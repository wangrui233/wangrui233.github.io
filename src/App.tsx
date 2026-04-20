import { useState, useEffect } from "react";
import "./App.css";

// 恋爱开始日期
const START_DATE = "2026-01-24";

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [days, setDays] = useState(0);
  const [stackIndex, setStackIndex] = useState(0);

  // 计算恋爱天数
  useEffect(() => {
    const calculateDays = () => {
      const start = new Date(START_DATE);
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      setDays(d);
    };
    calculateDays();
    const timer = setInterval(calculateDays, 1000 * 60 * 60);
    return () => clearInterval(timer);
  }, []);

  const memories = [
    {
      id: 1,
      title: "初见 · 2026.01.05",
      subtitle: "连空气都像被调成了柔焦，心动从这一刻开始。",
      date: "2026.01.05",
      image: "/images/39957.jpg",
      quote: "有些人，第一次见面就觉得已经认识了很久。"
    },
    {
      id: 2,
      title: "靠近 · 2026.01.12",
      subtitle: "每一次聊天、每一次期待，日子开始悄悄发光。",
      date: "2026.01.12",
      image: "/images/39981.jpg",
      quote: "喜欢是在慢慢靠近里变得具体的。"
    },
    {
      id: 3,
      title: "笃定 · 2026.01.24",
      subtitle: "确定关系的那一天，是冬天里最确定的一束光。",
      date: "2026.01.24",
      image: "/images/40250.jpg",
      quote: "把答案留在彼此身边，就是最好的回应。"
    },
    {
      id: 4,
      title: "未来 · 故事仍在继续",
      subtitle: "把温柔和心动都装进光影，陪你看以后的风景。",
      date: "Present",
      image: "/images/46370.jpg",
      quote: "最好的时间，就是现在，和你在一起。"
    }
  ];

  const galleryPhotos = [
    { id: 1, image: "/images/39957.jpg", title: "初见时刻", date: "2026.01.05", subtitle: "那天的阳光刚刚好" },
    { id: 2, image: "/images/39981.jpg", title: "漫步午后", date: "2026.01.12", subtitle: "渐渐靠近的心" },
    { id: 3, image: "/images/40250.jpg", title: "确定心意", date: "2026.01.24", subtitle: "我们的开始" },
    { id: 4, image: "/images/46370.jpg", title: "甜蜜瞬间", date: "2026.02.14", subtitle: "第一个情人节" },
    { id: 5, image: "/images/46372.jpg", title: "春日出游", date: "2026.03.20", subtitle: "万物复苏的温柔" },
    { id: 6, image: "/images/46373.jpg", title: "笑脸盈盈", date: "2026.04.10", subtitle: "最爱你的笑容" },
    { id: 7, image: "/images/1775987438834.jpeg", title: "温馨午餐", date: "2026.04.15", subtitle: "平凡日子的幸福" },
    { id: 8, image: "/images/49d102056e5b03a4d09d94b587dfcbfb.jpg", title: "落日余晖", date: "2026.04.18", subtitle: "陪你看每一个黄昏" },
  ];

  const loveNotes = [
    "“你是这平淡生活里，我最灿烂的意外。”",
    "“万物皆有回响，而我的回响是你。”",
    "“想和你分享所有细碎的喜悦，也想在风雨里为你撑伞。”"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % memories.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [memories.length]);

  const activeMemory = memories[currentIndex];

  const nextStack = () => {
    setStackIndex((prev) => (prev + 1) % galleryPhotos.length);
  };

  return (
    <div className="page-shell">
      {/* 氛围层 */}
      <div className="ambient ambient-a"></div>
      <div className="ambient ambient-b"></div>
      <div className="ambient ambient-c"></div>

      {/* 顶部导航 */}
      <nav className="top-nav">
        <div className="logo-text">Our Love</div>
        <div className="nav-links">
          <a href="#gallery">相册集</a>
          <a href="#timeline">时光轴</a>
        </div>
      </nav>

      <header className="hero" id="top">
        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow">A Story In January</p>
            <h1>有些故事，<br/>第一次见面就写好了。</h1>
            
            <div className="love-counter-minimal">
              <div className="counter-item">
                <span className="count">{days}</span>
                <span className="label">DAYS OF LOVE</span>
              </div>
            </div>

            <p className="hero-description">
              我们在 2026 年 1 月 5 日遇见，在 2026 年 1 月 24 日确定了彼此。这是一份记录心动与确定的纪念。
            </p>

            <div className="hero-actions">
              <a className="btn btn-primary" href="#gallery">浏览相册</a>
              <a className="btn btn-outline" href="#timeline">回溯时光</a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="spotlight-frame">
              <div className="spotlight-inner">
                <img src={activeMemory.image} alt={activeMemory.title} />
                <div className="spotlight-caption">
                  <p className="quote">{activeMemory.quote}</p>
                  <h3>{activeMemory.title}</h3>
                </div>
              </div>
            </div>
            <div className="scroll-indicator">
              <span>EXPLORE</span>
              <div className="line"></div>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* 心动语录 */}
        <section className="quote-section">
          <div className="quote-container">
            {loveNotes.map((note, idx) => (
              <p key={idx} className="love-note">{note}</p>
            ))}
          </div>
        </section>

        {/* 里程碑 */}
        <section className="milestone-section">
          <div className="section-header">
            <span className="subtitle">Milestones</span>
            <h2>我们的每一个第一次</h2>
          </div>
          <div className="milestone-grid">
            <div className="milestone-card">
              <div className="card-icon">✨</div>
              <h4>初次邂逅</h4>
              <p>2026.01.05 · 连空气都变甜了</p>
            </div>
            <div className="milestone-card">
              <div className="card-icon">💌</div>
              <h4>正式在一起</h4>
              <p>2026.01.24 · 最笃定的约定</p>
            </div>
            <div className="milestone-card">
              <div className="card-icon">🌹</div>
              <h4>首个情人节</h4>
              <p>2026.02.14 · 浪漫的延续</p>
            </div>
          </div>
        </section>

        {/* 时光轴 */}
        <section className="timeline-section" id="timeline">
          <div className="section-header">
            <span className="subtitle">Timeline</span>
            <h2>时间线上的温柔</h2>
          </div>
          <div className="modern-timeline">
            {memories.map((m, idx) => (
              <div key={m.id} className={`timeline-step ${idx % 2 === 0 ? 'left' : 'right'}`}>
                <div className="step-content">
                  <span className="step-date">{m.date}</span>
                  <h3>{m.title}</h3>
                  <p>{m.subtitle}</p>
                </div>
                <div className="step-dot"></div>
              </div>
            ))}
          </div>
        </section>

        {/* 叠放效果照片墙 */}
        <section className="gallery-section" id="gallery">
          <div className="section-header">
            <span className="subtitle">Gallery</span>
            <h2>我们的相册叠放</h2>
            <p className="gallery-desc">点击最上方的照片切换下一张，感受回忆的流动。</p>
          </div>
          
          <div className="stacked-gallery-container">
            <div className="stacked-gallery" onClick={nextStack}>
              {galleryPhotos.map((photo, idx) => {
                // 计算每个图片在叠放中的位置
                const total = galleryPhotos.length;
                const offset = (idx - stackIndex + total) % total;
                const isTop = offset === 0;
                
                // 只显示前 4 张图片以保持性能和美观
                if (offset > 3) return null;

                return (
                  <div
                    key={photo.id}
                    className={`stacked-item ${isTop ? 'top' : ''}`}
                    style={{
                      zIndex: total - offset,
                      transform: `translateY(${offset * -20}px) scale(${1 - offset * 0.05})`,
                      opacity: 1 - offset * 0.2,
                      visibility: offset > 3 ? 'hidden' : 'visible'
                    }}
                  >
                    <img src={photo.image} alt={photo.title} />
                    {isTop && (
                      <div className="stacked-info">
                        <span className="date">{photo.date}</span>
                        <h4>{photo.title}</h4>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* 点击提示 */}
            <div className="stack-hint">
              Tap to Flip 👆
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-content">
          <p className="copyright">© 2026 Our Story · 纪念每一个心动时刻</p>
          <div className="footer-badges">
            <span className="badge">01.05 初见</span>
            <span className="badge">01.24 相恋</span>
          </div>
        </div>
      </footer>

      {/* 沉浸式预览 (保留点击查看大图的功能) */}
      {selectedPhoto && (
        <div className="lightbox-overlay active">
          <div className="lightbox-close" onClick={() => setSelectedPhoto(null)}>✕</div>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <img src={selectedPhoto.image} alt={selectedPhoto.title} />
            <div className="lightbox-info">
              <span className="date">{selectedPhoto.date}</span>
              <h3>{selectedPhoto.title}</h3>
              <p>{selectedPhoto.subtitle}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
