/** Static picture of the globe: shows at once, and stays until the real one is ready. */
const GlobePoster = ({ hidden }: { hidden?: boolean }) => (
  <img
    className={`globe-poster transition-opacity duration-700 ${hidden ? 'opacity-0' : 'opacity-100'}`}
    src="/globe-poster-800.webp"
    srcSet="/globe-poster-480.webp 480w, /globe-poster-800.webp 800w"
    sizes="(min-width: 768px) 800px, 480px"
    alt=""
  />
);

export default GlobePoster;
