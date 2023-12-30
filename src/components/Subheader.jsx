function Subheader() {
  return (
    <div className="sm:text-md mb-3 grid grid-cols-1 gap-3 text-center text-2xl sm:my-10">
      <h2>Capturing your sweetest moments!</h2>

      <h2 className="mb-3">Serving Tampa Bay.</h2>

      <div className="mb-5">
        <a
          className="animate-pulse rounded-lg border-2 border-[#E9C18D] bg-[#CCD8E5] px-3 py-1 shadow-md"
          href="tel:19417797064"
        >
          <span className="sm:inline-block">Free quote!</span>
        </a>
      </div>

      <div className="flex flex-row justify-center">
        <a
          href="https://www.facebook.com/Gina-Zaffino-Photography-107431728394570/"
          target="_blank"
          rel="noreferrer"
        >
          <img src="fb.png" alt="facebook" />
        </a>
        <a
          href="https://www.instagram.com/ginazaffinophoto/"
          target="_blank"
          rel="noreferrer"
        >
          <img src="insta.png" alt="instagram" />
        </a>
      </div>
    </div>
  );
}

export default Subheader;
