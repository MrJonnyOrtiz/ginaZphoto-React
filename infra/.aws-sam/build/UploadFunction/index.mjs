import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { LambdaClient, UpdateFunctionConfigurationCommand, GetFunctionConfigurationCommand } from '@aws-sdk/client-lambda';
import bcrypt from 'bcryptjs';
import Busboy from 'busboy';
import sharp from 'sharp';

const s3 = new S3Client({});
const lambda = new LambdaClient({});
const BUCKET = process.env.BUCKET_NAME;
const MANIFEST_KEY = 'gallery.json';

export const handler = async (event) => {
  const path = event.requestContext?.http?.path || event.rawPath;
  const method = event.requestContext?.http?.method || event.httpMethod;

  // Auth check for all routes
  const password = event.headers?.['x-admin-password'] || '';
  const valid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
  if (!valid) return respond(401, { error: 'Unauthorized' });

  if (method === 'GET' && path === '/images') return handleList();
  if (method === 'POST' && path === '/upload') return handleUpload(event);
  if (method === 'POST' && path === '/delete') return handleDelete(event);
  if (method === 'POST' && path === '/feature') return handleFeature(event);
  if (method === 'POST' && path === '/change-password') return handleChangePassword(event);

  return respond(404, { error: 'Not found' });
};

async function handleUpload(event) {
  const { buffer, alt, category } = await parseMultipart(event);
  if (!buffer || !alt || !category) return respond(400, { error: 'Missing image, alt, or category' });

  const processed = sharp(buffer).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 80 });
  const output = await processed.toBuffer();
  const metadata = await sharp(output).metadata();

  const slug = alt.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const key = `uploads/${Date.now()}-${slug}.webp`;

  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: output,
    ContentType: 'image/webp',
    CacheControl: 'public, max-age=31536000',
  }));

  const entry = { src: `/${key}`, alt, category, width: metadata.width, height: metadata.height, featured: false };
  const manifest = await getManifest();
  manifest.push(entry);
  await putManifest(manifest);

  return respond(200, entry);
}

async function handleDelete(event) {
  const body = JSON.parse(event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString() : event.body);
  const { src } = body;
  if (!src) return respond(400, { error: 'Missing src' });

  const key = src.startsWith('/') ? src.slice(1) : src;
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));

  const manifest = await getManifest();
  const updated = manifest.filter((img) => img.src !== src);
  await putManifest(updated);

  return respond(200, { deleted: src });
}

async function handleFeature(event) {
  const body = JSON.parse(event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString() : event.body);
  const { src, featured } = body;
  if (!src) return respond(400, { error: 'Missing src' });

  const manifest = await getManifest();
  const entry = manifest.find((img) => img.src === src);
  if (!entry) return respond(404, { error: 'Image not found' });
  entry.featured = !!featured;
  await putManifest(manifest);

  return respond(200, { src, featured: entry.featured });
}

async function handleChangePassword(event) {
  const body = JSON.parse(event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString() : event.body);
  const { newPassword } = body;
  if (!newPassword || newPassword.length < 8) return respond(400, { error: 'Password must be at least 8 characters' });

  const hash = bcrypt.hashSync(newPassword, 10);
  const funcName = process.env.AWS_LAMBDA_FUNCTION_NAME;

  const config = await lambda.send(new GetFunctionConfigurationCommand({ FunctionName: funcName }));
  const env = config.Environment.Variables;
  env.ADMIN_PASSWORD_HASH = hash;

  await lambda.send(new UpdateFunctionConfigurationCommand({
    FunctionName: funcName,
    Environment: { Variables: env },
  }));

  process.env.ADMIN_PASSWORD_HASH = hash;
  return respond(200, { message: 'Password updated' });
}

async function handleList() {
  const manifest = await getManifest();
  return respond(200, manifest);
}

async function getManifest() {
  try {
    const res = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: MANIFEST_KEY }));
    const text = await res.Body.transformToString();
    return JSON.parse(text);
  } catch {
    return [];
  }
}

async function putManifest(data) {
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: MANIFEST_KEY,
    Body: JSON.stringify(data, null, 2),
    ContentType: 'application/json',
    CacheControl: 'public, max-age=60',
  }));
}

function parseMultipart(event) {
  return new Promise((resolve, reject) => {
    const contentType = event.headers?.['content-type'] || event.headers?.['Content-Type'] || '';
    const busboy = Busboy({ headers: { 'content-type': contentType } });
    let buffer = null;
    let alt = '';
    let category = '';

    busboy.on('file', (_, stream) => {
      const chunks = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => { buffer = Buffer.concat(chunks); });
    });

    busboy.on('field', (name, value) => {
      if (name === 'alt') alt = value;
      if (name === 'category') category = value;
    });

    busboy.on('finish', () => resolve({ buffer, alt, category }));
    busboy.on('error', reject);

    const body = event.isBase64Encoded ? Buffer.from(event.body, 'base64') : Buffer.from(event.body);
    busboy.end(body);
  });
}

function respond(status, body) {
  return { statusCode: status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}
