import './VideoGrid.css';

const formatDate = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
    });
  } catch {
    return '';
  }
};

const VideoCard = ({ video, index }) => (
  <a
    className="vid rise"
    style={{ animationDelay: `${index * 45}ms` }}
    href={`https://www.youtube.com/watch?v=${video.id}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    <div className="vid__media">
      <img src={video.thumbnail} alt="" loading="lazy" />
      <span className="vid__play" aria-hidden="true">
        ▶
      </span>
    </div>
    <div className="vid__body">
      <h3 className="vid__title">{video.title}</h3>
      <p className="vid__meta">
        <span>{video.channel}</span>
        <span aria-hidden="true">·</span>
        <span>{formatDate(video.publishedAt)}</span>
      </p>
    </div>
  </a>
);

const GhostCard = () => (
  <div className="vid vid--ghost">
    <div className="vid__media skeleton" />
    <div className="vid__body">
      <div className="vid__ghost-line skeleton" />
      <div className="vid__ghost-line vid__ghost-line--short skeleton" />
    </div>
  </div>
);

const VideoGrid = ({ videos, loading }) => (
  <div className="vid-grid">
    {loading
      ? Array.from({ length: 8 }).map((_, i) => <GhostCard key={`ghost-${i}`} />)
      : videos.map((video, i) => <VideoCard key={video.id} video={video} index={i} />)}
  </div>
);

export default VideoGrid;
