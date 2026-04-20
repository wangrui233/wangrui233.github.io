import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { MapChart, EffectScatterChart } from "echarts/charts";
import { GeoComponent, TooltipComponent } from "echarts/components";
import { init, registerMap, use, type ECharts } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import chinaMap from "./assets/maps/china.json";
import "./App.css";

use([MapChart, EffectScatterChart, GeoComponent, TooltipComponent, CanvasRenderer]);

type View =
  | { name: "home" }
  | { name: "gallery" }
  | { name: "location"; locationId: string };

type PhotoEntry = {
  id: number;
  src: string;
  title: string;
  date: string;
  copy: string;
  quote: string;
  author: string;
};

type TimelineEvent = {
  date: string;
  label: string;
  detail: string;
  tag: string;
};

type LocationEntry = {
  id: string;
  name: string;
  cityLabel: string;
  coords: [number, number];
  summary: string;
  detail: string;
  accent: string;
  photos: string[];
  note: string;
};

type GalleryTheme = {
  base: string;
  glow: string;
  accent: string;
};

const KNOWN_DATE = "2026-01-05T00:00:00+08:00";
const TOGETHER_DATE = "2026-01-24T00:00:00+08:00";

const personPhotos: PhotoEntry[] = [
  {
    id: 1,
    src: "/images/39957.jpg",
    title: "第一眼的温柔",
    date: "2026.01.05",
    copy: "那天的风并不喧闹，可你站在那里，就像把整个冬天都变得轻轻的。",
    quote: "Love is composed of a single soul inhabiting two bodies.",
    author: "Aristotle",
  },
  {
    id: 2,
    src: "/images/39981.jpg",
    title: "笑意落在眼睛里",
    date: "2026.01.12",
    copy: "你笑起来的时候，连普通的街景都会突然有了电影感，让我忍不住想把这一刻存档。",
    quote: "Whatever our souls are made of, his and mine are the same.",
    author: "Emily Bronte",
  },
  {
    id: 3,
    src: "/images/40250.jpg",
    title: "故事开始发光",
    date: "2026.01.24",
    copy: "从这一天起，喜欢不再只是心动，而是带着答案的笃定，是认真想一起走很久很久。",
    quote: "Grow old along with me; the best is yet to be.",
    author: "Robert Browning",
  },
  {
    id: 4,
    src: "/images/46370.jpg",
    title: "被偏爱的日常",
    date: "2026.02.14",
    copy: "节日会过去，可被你认真对待的感觉，会在之后的每一天里继续发着小小的光。",
    quote: "Where there is love there is life.",
    author: "Mahatma Gandhi",
  },
  {
    id: 5,
    src: "/images/46372.jpg",
    title: "春风也认得你",
    date: "2026.03.20",
    copy: "春天本来就很柔软，可是和你站在一起时，连空气都像在轻声说喜欢。",
    quote: "I have found the one whom my soul loves.",
    author: "Song of Solomon",
  },
  {
    id: 6,
    src: "/images/46373.jpg",
    title: "盛开的模样",
    date: "2026.04.10",
    copy: "你认真生活的样子总是很动人，好像每一个平凡时刻都会因为你而多出一点花香。",
    quote: "If I know what love is, it is because of you.",
    author: "Hermann Hesse",
  },
  {
    id: 7,
    src: "/images/1775987438834.jpeg",
    title: "温热的陪伴",
    date: "2026.04.15",
    copy: "一起吃饭、散步、看天色慢慢变暗，这些普通片段，因为有你，就都值得反复回味。",
    quote: "To love and be loved is to feel the sun from both sides.",
    author: "David Viscott",
  },
  {
    id: 8,
    src: "/images/49d102056e5b03a4d09d94b587dfcbfb.jpg",
    title: "想陪你看很久",
    date: "2026.04.18",
    copy: "如果黄昏有收藏价值，那一定是因为我想把所有好看的天色都留给和你并肩的时刻。",
    quote: "In all the world, there is no heart for me like yours.",
    author: "Maya Angelou",
  },
  {
    id: 9,
    src: "/images/9bd1eac38f2c9eefe18b0fd88b5cbe0b.jpg",
    title: "你就是答案",
    date: "2026.04.19",
    copy: "有些心安不是道理讲出来的，而是你出现之后，很多关于未来的问题突然都有了答案。",
    quote: "You are every lovely thing my heart has ever looked for.",
    author: "Rupi Kaur",
  },
  {
    id: 10,
    src: "/images/a3c58c1c78d951df4dd440c72c0e454e.jpg",
    title: "把心动写成长信",
    date: "2026.04.20",
    copy: "这份喜欢已经不止是瞬间的烟火，更像一封越写越长的信，落款一直都是我们。",
    quote: "There is always some madness in love. But there is also always some reason in madness.",
    author: "Friedrich Nietzsche",
  },
];

const galleryThemes: GalleryTheme[] = [
  { base: "#fff6f7", glow: "#ffd9e5", accent: "#d7ebff" },
  { base: "#fff9f2", glow: "#ffe3d0", accent: "#d8f2ff" },
  { base: "#fef7ff", glow: "#f4dfff", accent: "#d9edff" },
  { base: "#fff8fb", glow: "#ffd8e9", accent: "#e0f0ff" },
  { base: "#f8fffb", glow: "#d6f4e8", accent: "#d8ebff" },
  { base: "#fffaf5", glow: "#ffe7d7", accent: "#e2f3ff" },
  { base: "#f9fbff", glow: "#dce7ff", accent: "#ffe1ea" },
  { base: "#fff7f6", glow: "#ffd8d5", accent: "#dff0ff" },
  { base: "#fcfbff", glow: "#ece2ff", accent: "#dfeeff" },
  { base: "#fffaf8", glow: "#ffe4dc", accent: "#dcefff" },
];

const timelineEvents: TimelineEvent[] = [
  {
    date: "2026.01.05",
    label: "第一次认识",
    detail: "故事在这一天轻轻翻开第一页，目光交汇后，普通日子开始变得特别。",
    tag: "相识",
  },
  {
    date: "2026.01.24",
    label: "正式在一起",
    detail: "从喜欢到确认心意，我们把彼此写进未来，也把这一天写成新的起点。",
    tag: "恋爱开始",
  },
  {
    date: "2026.03.31",
    label: "恋爱 66 天",
    detail: "第 66 天像一个温柔的里程碑，提醒我们，甜蜜不是瞬间，而是被认真经营的每一天。",
    tag: "66 天",
  },
  {
    date: "未完待续",
    label: "更多纪念日",
    detail: "下一次旅行、下一场日落、下一句认真说出的喜欢，都在继续奔向我们。",
    tag: "To Be Continued",
  },
];

const travelLocations: LocationEntry[] = [
  {
    id: "nanjing",
    name: "南京",
    cityLabel: "秦淮的晚风和并肩的脚步",
    coords: [118.7969, 32.0603],
    summary: "古城夜色很温柔，像把我们的步伐也放慢了下来。",
    detail:
      "石板路、晚风和一路聊不完的话题，让这座城市变成了会发光的旅行回忆。",
    accent: "#f29cb7",
    photos: [
      "/trips/nanjing-1.jpg",
      "/trips/nanjing-2.jpg",
      "/trips/nanjing-3.jpg",
      "/trips/nanjing-4.jpg",
    ],
    note: "南京像一封旧信，慢慢读的时候，刚好适合把喜欢说得更久一点。",
  },
  {
    id: "hefei",
    name: "合肥",
    cityLabel: "下一次见面的目的地",
    coords: [117.2272, 31.8206],
    summary: "地图上已经为它留了位置，只等下一次一起去把故事补全。",
    detail:
      "这站的照片还没来得及存进相册，但期待本身就很浪漫，它让未来有了清晰的方向。",
    accent: "#8ebeff",
    photos: [],
    note: "有些城市还没有影像，却已经因为想和你一起去，而带上了温度。",
  },
  {
    id: "luan",
    name: "六安",
    cityLabel: "被山水轻轻抱住的一天",
    coords: [116.5077, 31.7529],
    summary: "风景是背景，真正留下来的还是一路上的笑声和陪伴。",
    detail:
      "在六安的相册里，安静的景和轻松的时刻叠在一起，像一次没有赶时间的心动散步。",
    accent: "#8fd5c7",
    photos: ["/trips/luan-1.jpeg", "/trips/luan-2.jpeg"],
    note: "一起去过的地方，最后都会长成回忆里柔软的一部分。",
  },
];

const routeFromHash = (hash: string): View => {
  const normalized = hash.replace(/^#/, "") || "/";
  if (normalized === "/gallery") {
    return { name: "gallery" };
  }
  if (normalized.startsWith("/travel/")) {
    const locationId = normalized.replace("/travel/", "");
    return { name: "location", locationId };
  }
  return { name: "home" };
};

const daysSince = (dateString: string) =>
  Math.max(
    0,
    Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24)),
  );

const navigateTo = (path: string) => {
  window.location.hash = path;
};

registerMap("china", chinaMap as never);

function App() {
  const [view, setView] = useState<View>(() => routeFromHash(window.location.hash));
  const [knownDays, setKnownDays] = useState(() => daysSince(KNOWN_DATE));
  const [togetherDays, setTogetherDays] = useState(() => daysSince(TOGETHER_DATE));
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [detailPhotoIndex, setDetailPhotoIndex] = useState(0);
  const [mapStatus, setMapStatus] = useState<"loading" | "ready" | "fallback">("loading");
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onHashChange = () => setView(routeFromHash(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const updateDays = () => {
      setKnownDays(daysSince(KNOWN_DATE));
      setTogetherDays(daysSince(TOGETHER_DATE));
    };

    updateDays();
    const timer = window.setInterval(updateDays, 60 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  const activePhoto = personPhotos[activePhotoIndex];
  const activeLocation = useMemo(
    () =>
      view.name === "location"
        ? travelLocations.find((location) => location.id === view.locationId) ?? null
        : null,
    [view],
  );

  useEffect(() => {
    if (view.name === "gallery") {
      setActivePhotoIndex(0);
    }
    if (view.name === "location") {
      setDetailPhotoIndex(0);
    }
  }, [view]);

  useEffect(() => {
    if (view.name !== "home" || !mapRef.current) {
      return;
    }

    let chart: ECharts | null = null;
    let onResize: (() => void) | null = null;

    try {
      setMapStatus("loading");
      chart = init(mapRef.current);
      chart.setOption({
        backgroundColor: "transparent",
        tooltip: {
          trigger: "item",
          formatter: (params: { data?: { name?: string; summary?: string } }) => {
            if (!params.data) {
              return "";
            }
            return `<strong>${params.data.name ?? ""}</strong><br/>${params.data.summary ?? ""}`;
          },
        },
        geo: {
          map: "china",
          roam: false,
          zoom: 1.12,
          label: {
            show: false,
          },
          itemStyle: {
            areaColor: "#f8d8e5",
            borderColor: "#ffffff",
            borderWidth: 1.2,
            shadowColor: "rgba(112, 154, 214, 0.15)",
            shadowBlur: 24,
          },
          emphasis: {
            itemStyle: {
              areaColor: "#cfe3ff",
            },
          },
        },
        series: [
          {
            type: "effectScatter",
            coordinateSystem: "geo",
            rippleEffect: {
              scale: 4,
              brushType: "stroke",
            },
            itemStyle: {
              color: "#f07ea1",
              shadowBlur: 18,
              shadowColor: "rgba(240, 126, 161, 0.35)",
            },
            symbolSize: 16,
            data: travelLocations.map((location) => ({
              id: location.id,
              name: location.name,
              value: [...location.coords, 1],
              summary: location.summary,
            })),
          },
        ],
      });

      chart.on("click", (params) => {
        const locationId =
          params.data && typeof params.data === "object" && "id" in params.data
            ? params.data.id
            : undefined;

        if (typeof locationId === "string") {
          navigateTo(`/travel/${locationId}`);
        }
      });

      onResize = () => chart?.resize();
      window.addEventListener("resize", onResize);
      setMapStatus("ready");
    } catch (error) {
      setMapStatus("fallback");
    }

    return () => {
      if (onResize) {
        window.removeEventListener("resize", onResize);
      }
      chart?.off?.("click");
      chart?.dispose();
    };
  }, [view.name]);

  const galleryStack = personPhotos.map((photo, index) => {
    const stackIndex =
      (index - activePhotoIndex + personPhotos.length) % personPhotos.length;
    const visibleOffset = Math.min(stackIndex, 4);
    const isCurrent = stackIndex === 0;

    return {
      ...photo,
      isCurrent,
      stackIndex,
      visibleOffset,
    };
  });

  const nextGalleryPhoto = () => {
    setActivePhotoIndex((current) => (current + 1) % personPhotos.length);
  };

  const locationPhotos = activeLocation?.photos ?? [];
  const currentLocationPhoto =
    locationPhotos.length > 0
      ? locationPhotos[detailPhotoIndex % locationPhotos.length]
      : null;
  const activeGalleryTheme = galleryThemes[activePhotoIndex % galleryThemes.length];

  if (view.name === "gallery") {
    return (
      <div
        className="app-shell gallery-shell"
        style={
          {
            "--gallery-base": activeGalleryTheme.base,
            "--gallery-glow": activeGalleryTheme.glow,
            "--gallery-accent": activeGalleryTheme.accent,
          } as CSSProperties
        }
      >
        <div className="floating-backdrop" />
        <header className="detail-header">
          <button className="back-button" onClick={() => navigateTo("/")}>
            返回主页
          </button>
          <div>
            <p className="detail-kicker">美照记录</p>
            <h1>把每一次心动都排成一座会发光的画廊</h1>
          </div>
        </header>

        <main className="gallery-page">
          <section className="gallery-stage">
            <div className="gallery-stack">
              {galleryStack.map((photo) => (
                <button
                  key={photo.id}
                  className={`gallery-card ${photo.isCurrent ? "is-current" : ""}`}
                  style={
                    {
                      "--offset": photo.visibleOffset,
                    } as CSSProperties
                  }
                  data-hidden={photo.stackIndex > 4}
                  onClick={() =>
                    photo.isCurrent
                      ? nextGalleryPhoto()
                      : setActivePhotoIndex(
                          personPhotos.findIndex((entry) => entry.id === photo.id),
                        )
                  }
                  aria-label={`查看 ${photo.title}`}
                >
                  <img src={photo.src} alt={photo.title} />
                </button>
              ))}
            </div>
          </section>

          <aside className="gallery-copy-panel">
            <p className="detail-kicker">Photo {String(activePhotoIndex + 1).padStart(2, "0")}</p>
            <h2>{activePhoto.title}</h2>
            <p className="gallery-copy">{activePhoto.copy}</p>
            <blockquote className="quote-card">
              <p>{activePhoto.quote}</p>
              <footer>{activePhoto.author}</footer>
            </blockquote>

            <div className="gallery-thumbs">
              {personPhotos.map((photo, index) => (
                <button
                  key={photo.id}
                  className={index === activePhotoIndex ? "is-active" : ""}
                  onClick={() => setActivePhotoIndex(index)}
                  aria-label={`切换到 ${photo.title}`}
                >
                  <img src={photo.src} alt={photo.title} />
                </button>
              ))}
            </div>
          </aside>
        </main>
      </div>
    );
  }

  if (view.name === "location" && activeLocation) {
    return (
      <div className="app-shell location-shell">
        <div className="location-aurora" />
        <header className="detail-header">
          <button className="back-button" onClick={() => navigateTo("/")}>
            返回主页
          </button>
          <div>
            <p className="detail-kicker">恋爱地图</p>
            <h1>{activeLocation.name}</h1>
          </div>
        </header>

        <main className="location-page">
          <section className="location-hero-card">
            <div className="location-copy">
              <span className="location-chip" style={{ background: activeLocation.accent }}>
                {activeLocation.cityLabel}
              </span>
              <h2>{activeLocation.summary}</h2>
              <p>{activeLocation.detail}</p>
              <blockquote>{activeLocation.note}</blockquote>
            </div>

            <div className="location-media">
              {currentLocationPhoto ? (
                <button
                  className={`location-photo-stack ${
                    locationPhotos.length > 1 ? "is-clickable" : ""
                  }`}
                  onClick={() => {
                    if (locationPhotos.length > 1) {
                      setDetailPhotoIndex(
                        (current) => (current + 1) % locationPhotos.length,
                      );
                    }
                  }}
                  aria-label={
                    locationPhotos.length > 1
                      ? `切换${activeLocation.name}的下一张照片`
                      : `${activeLocation.name}的照片`
                  }
                >
                  <img
                    src={currentLocationPhoto}
                    alt={activeLocation.name}
                    key={`${currentLocationPhoto}-${detailPhotoIndex}`}
                    className="location-photo-frame"
                  />
                  {locationPhotos.length > 1 ? (
                    <div className="location-stack-dots" aria-hidden="true">
                      {locationPhotos.map((photo, index) => (
                        <span
                          key={photo}
                          className={index === detailPhotoIndex ? "is-active" : ""}
                        />
                      ))}
                    </div>
                  ) : null}
                </button>
              ) : (
                <div className="location-placeholder">
                  <span>照片待补完</span>
                  <p>先把期待放进地图里，等下一次一起去按下快门。</p>
                </div>
              )}
            </div>
          </section>

          <section className="location-grid">
            {travelLocations.map((location) => (
              <button
                key={location.id}
                className={`location-mini-card ${
                  location.id === activeLocation.id ? "is-selected" : ""
                }`}
                onClick={() => navigateTo(`/travel/${location.id}`)}
              >
                <strong>{location.name}</strong>
                <span>{location.summary}</span>
              </button>
            ))}
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="brand">Love Notes</p>
          <span className="brand-subtitle">2026 · from hello to forever</span>
        </div>
        <nav>
          <button onClick={() => navigateTo("/gallery")}>美照记录</button>
        </nav>
      </header>

      <main className="home-page">
        <section className="hero-panel">
          <div className="hero-copy">
            <p className="hero-kicker">恋爱纪念</p>
            <h1>把相识、心动和一起去过的地方，都认真收藏成会呼吸的页面。</h1>
            <p className="hero-text">
              从第一次认识开始，日子就像被温柔上色。这个页面记录我们走过的节点，也给未来留好了继续书写的位置。
            </p>

            <div className="hero-actions">
              <button className="primary-button" onClick={() => navigateTo("/gallery")}>
                进入美照记录
              </button>
              <a className="secondary-button" href="#timeline">
                看时间线
              </a>
            </div>
          </div>

          <div className="hero-visual-card">
            <img src="/images/40250.jpg" alt="恋爱纪念封面" />
            <div className="hero-visual-copy">
              <span>Chapter 01</span>
              <strong>我们已经认识了 {knownDays} 天</strong>
              <p>从 2026.01.05 开始，喜欢有了名字，日子也有了想分享的人。</p>
            </div>
          </div>
        </section>

        <section className="stats-panel">
          <article className="stat-card stat-card-main">
            <span className="stat-label">相识天数</span>
            <strong>{knownDays}</strong>
            <p>从第一次认识到现在，每一天都在持续生长成更笃定的喜欢。</p>
          </article>
          <article className="stat-card">
            <span className="stat-label">在一起天数</span>
            <strong>{togetherDays}</strong>
            <p>从 2026.01.24 开始，未来两个字变得具体又温柔。</p>
          </article>
          <article className="stat-card">
            <span className="stat-label">下一站</span>
            <strong>To Be Continued</strong>
            <p>时间线会继续延长，地图也会继续亮起新的坐标。</p>
          </article>
        </section>

        <section className="timeline-panel" id="timeline">
          <div className="section-heading">
            <p>恋爱时间线</p>
            <h2>几个重要节点，把故事从心动排成了顺序</h2>
          </div>

          <div className="timeline-list">
            {timelineEvents.map((event, index) => (
              <article key={event.label} className="timeline-card">
                <div className="timeline-marker">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="timeline-content">
                  <span className="timeline-tag">{event.tag}</span>
                  <h3>{event.label}</h3>
                  <time>{event.date}</time>
                  <p>{event.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="entry-panel">
          <div className="entry-card entry-gallery">
            <div className="entry-copy">
              <p>美照记录</p>
              <h2>把她的每一个漂亮瞬间，排成一叠轻轻晃动的心动卡片。</h2>
              <span>单独页面 · 点击切换 · 温柔文案</span>
            </div>
            <button className="ghost-button" onClick={() => navigateTo("/gallery")}>
              打开画廊
            </button>
          </div>

          <div className="entry-card entry-map">
            <div className="entry-copy">
              <p>恋爱地图</p>
              <h2>去过的地方，会在地图上慢慢亮起来。</h2>
              <span>点击城市进入详情页，查看当地旅行照片与回忆。</span>
            </div>
          </div>
        </section>

        <section className="map-panel">
          <div className="section-heading">
            <p>恋爱地图</p>
            <h2>用地图给回忆做坐标，想去的地方也先替它留个位置</h2>
          </div>

          <div className="map-layout">
            <div className="map-canvas-wrap">
              <div className="map-canvas" ref={mapRef} />
              {mapStatus !== "ready" ? (
                <div className="map-fallback">
                  <p>
                    {mapStatus === "loading"
                      ? "地图加载中..."
                      : "当前环境未成功加载 ECharts 地图，下面的城市卡片仍可进入详情。"}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="map-side-list">
              {travelLocations.map((location) => (
                <button
                  key={location.id}
                  className="map-city-card"
                  onClick={() => navigateTo(`/travel/${location.id}`)}
                >
                  <strong>{location.name}</strong>
                  <span>{location.summary}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
