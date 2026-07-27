"use client";

import { useMemo, useState } from "react";

type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
  stock: number;
  status: "上架" | "預購" | "下架";
  image: string;
  badge: string;
  sold: number;
};

const products: Product[] = [
  {
    id: 1,
    title: "Pop Mart 熊系甜點派對盲盒",
    category: "盲盒",
    price: 390,
    stock: 48,
    status: "上架",
    image: "linear-gradient(135deg, #fff3d9 0%, #ffd071 48%, #67c7bd 100%)",
    badge: "現貨",
    sold: 126,
  },
  {
    id: 2,
    title: "日版動漫小賞 A賞 景品套組",
    category: "一番賞",
    price: 680,
    stock: 18,
    status: "預購",
    image: "linear-gradient(135deg, #eef2ff 0%, #f8b4d9 46%, #4c7bd9 100%)",
    badge: "預購",
    sold: 84,
  },
  {
    id: 3,
    title: "三麗鷗角色吊飾隨機包",
    category: "吊飾",
    price: 199,
    stock: 76,
    status: "上架",
    image: "linear-gradient(135deg, #e5fbff 0%, #9ee8e0 45%, #ffcf6a 100%)",
    badge: "免運門檻",
    sold: 211,
  },
  {
    id: 4,
    title: "熊賀勝限定幸運小賞組",
    category: "小賞",
    price: 99,
    stock: 120,
    status: "上架",
    image: "linear-gradient(135deg, #fff 0%, #ff8b38 43%, #7f4a27 100%)",
    badge: "熱銷",
    sold: 390,
  },
  {
    id: 5,
    title: "NARUTO 壓克力立牌收藏組",
    category: "立牌",
    price: 580,
    stock: 22,
    status: "預購",
    image: "linear-gradient(135deg, #f2f6ff 0%, #ff6b4a 50%, #1f3760 100%)",
    badge: "預購",
    sold: 65,
  },
  {
    id: 6,
    title: "寶可夢迷你公仔盲抽盒",
    category: "公仔",
    price: 320,
    stock: 54,
    status: "上架",
    image: "linear-gradient(135deg, #fff7cc 0%, #5cc8a7 48%, #2f6dd6 100%)",
    badge: "新品",
    sold: 173,
  },
];

const members = [
  { name: "陳小熊", level: "金熊會員", orders: 18, spent: 12860, status: "正常" },
  { name: "林美美", level: "銀熊會員", orders: 7, spent: 3860, status: "正常" },
  { name: "王阿勝", level: "新會員", orders: 1, spent: 390, status: "需驗證" },
];

const revenue = [
  { label: "今日營收", value: "$18,420", change: "+12%" },
  { label: "本月訂單", value: "326", change: "+28" },
  { label: "待出貨", value: "42", change: "7-11 佔 61%" },
  { label: "庫存警示", value: "8", change: "低於 20 件" },
];

export default function Home() {
  const [cart, setCart] = useState<Product[]>([products[0], products[3]]);
  const [signedIn, setSignedIn] = useState(false);
  const [adminView, setAdminView] = useState("dashboard");
  const [delivery, setDelivery] = useState("711");
  const [category, setCategory] = useState("全部商品");

  const visibleProducts = useMemo(
    () =>
      category === "全部商品"
        ? products
        : products.filter((product) => product.category === category),
    [category]
  );

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const shipping = delivery === "711" ? 60 : 120;

  return (
    <main className="site-shell">
      <header className="topbar" id="home">
        <a className="brand" href="#home" aria-label="熊賀勝首頁">
          <img src="/bear-toys-logo.png" alt="熊賀勝 Bear Toys" />
          <span>
            <strong>熊賀勝</strong>
            <small>Bear Toys</small>
          </span>
        </a>
        <label className="search">
          <span>搜尋</span>
          <input placeholder="搜尋盲盒、小賞、預購商品" />
          <button type="button">搜本店</button>
        </label>
        <nav className="quick-actions" aria-label="會員與購物功能">
          <a href="#cart">購物車 {cart.length}</a>
          <a href="#profile">會員</a>
          <a href="#admin">後台</a>
        </nav>
      </header>

      <nav className="category-nav" aria-label="商品分類">
        {["全部商品", "盲盒", "小賞", "一番賞", "吊飾", "公仔", "立牌"].map(
          (item) => (
            <button
              className={category === item ? "active" : ""}
              key={item}
              onClick={() => setCategory(item)}
              type="button"
            >
              {item}
            </button>
          )
        )}
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p>高雄實體玩具店 · 盲盒與小賞專門</p>
          <h1>熊賀勝線上商店</h1>
          <span>
            Line Pay 結帳、7-11 取貨與宅配送達，會員登入後可管理個人資料與追蹤訂單。
          </span>
          <div className="hero-actions">
            <a href="#products">逛最新上架</a>
            <a href="https://www.facebook.com/profile.php?id=100095394499752">
              前往 FB
            </a>
          </div>
        </div>
        <aside className="store-card" aria-label="店家資訊">
          <strong>熊賀勝 Bear Toys</strong>
          <span>807 高雄市三民區本安里信國路 32 號</span>
          <span>營業資訊、抽賞公告與新品預購可同步 FB 粉專。</span>
        </aside>
      </section>

      <section className="section-heading" id="products">
        <div>
          <p>NEW</p>
          <h2>最新上架</h2>
        </div>
        <a href="#cart">滿 $999 享 7-11 免運活動</a>
      </section>

      <section className="product-grid" aria-label="商品列表">
        {visibleProducts.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-image" style={{ background: product.image }}>
              <span>{product.badge}</span>
              <b>{product.status}</b>
            </div>
            <div className="product-body">
              <p>{product.category}</p>
              <h3>{product.title}</h3>
              <div className="product-meta">
                <strong>${product.price.toLocaleString()}</strong>
                <span>已售 {product.sold}</span>
              </div>
              <div className="product-actions">
                <button type="button">收藏</button>
                <button type="button" onClick={() => setCart([...cart, product])}>
                  加入購物車
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="checkout-band" id="cart">
        <div className="cart-panel">
          <div className="section-heading compact">
            <div>
              <p>CHECKOUT</p>
              <h2>購物車與付款</h2>
            </div>
          </div>
          <div className="cart-list">
            {cart.map((item, index) => (
              <div className="cart-row" key={`${item.id}-${index}`}>
                <span>{item.title}</span>
                <strong>${item.price.toLocaleString()}</strong>
              </div>
            ))}
          </div>
          <div className="delivery-options" aria-label="配送方式">
            <button
              className={delivery === "711" ? "selected" : ""}
              onClick={() => setDelivery("711")}
              type="button"
            >
              7-11 取貨付款資訊
            </button>
            <button
              className={delivery === "home" ? "selected" : ""}
              onClick={() => setDelivery("home")}
              type="button"
            >
              宅配到府
            </button>
          </div>
          <div className="payment-box">
            <span>付款方式</span>
            <strong>Line Pay</strong>
            <p>
              正式上線時可串接 Line Pay API，建立付款請求後導回訂單完成頁。
            </p>
          </div>
          <div className="total-row">
            <span>商品 ${subtotal.toLocaleString()} + 運費 ${shipping}</span>
            <strong>${(subtotal + shipping).toLocaleString()}</strong>
          </div>
          <button className="primary-button" type="button">
            前往 Line Pay 結帳
          </button>
        </div>

        <div className="profile-panel" id="profile">
          <div className="section-heading compact">
            <div>
              <p>MEMBER</p>
              <h2>會員中心</h2>
            </div>
          </div>
          <div className="login-card">
            <strong>{signedIn ? "陳小熊，歡迎回來" : "登入後管理個人資料"}</strong>
            <p>
              支援一般註冊登入，並預留 Facebook OAuth 註冊登入入口。
            </p>
            <div className="login-actions">
              <button type="button" onClick={() => setSignedIn(!signedIn)}>
                {signedIn ? "登出" : "會員登入"}
              </button>
              <button type="button">Facebook 註冊登入</button>
            </div>
          </div>
          <form className="profile-form">
            <label>
              姓名
              <input defaultValue="陳小熊" disabled={!signedIn} />
            </label>
            <label>
              手機
              <input defaultValue="0912-345-678" disabled={!signedIn} />
            </label>
            <label>
              常用 7-11 門市
              <input defaultValue="高雄信國門市" disabled={!signedIn} />
            </label>
            <label>
              宅配地址
              <input defaultValue="高雄市三民區信國路 32 號" disabled={!signedIn} />
            </label>
          </form>
          <button className="secondary-button" disabled={!signedIn} type="button">
            儲存會員資料
          </button>
        </div>
      </section>

      <section className="admin" id="admin">
        <div className="section-heading">
          <div>
            <p>ADMIN</p>
            <h2>熊賀勝商家後台</h2>
          </div>
          <span>庫存、會員、商品上下架與營收監控</span>
        </div>
        <div className="admin-layout">
          <aside className="admin-tabs" aria-label="後台功能">
            {[
              ["dashboard", "營收監控"],
              ["inventory", "庫存管理"],
              ["products", "商品上下架"],
              ["members", "會員管理"],
            ].map(([id, label]) => (
              <button
                className={adminView === id ? "active" : ""}
                key={id}
                onClick={() => setAdminView(id)}
                type="button"
              >
                {label}
              </button>
            ))}
          </aside>

          <div className="admin-content">
            {adminView === "dashboard" && (
              <>
                <div className="metric-grid">
                  {revenue.map((item) => (
                    <article className="metric-card" key={item.label}>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                      <p>{item.change}</p>
                    </article>
                  ))}
                </div>
                <div className="ops-table">
                  <div><b>Line Pay 成功率</b><span>98.2%</span></div>
                  <div><b>7-11 待建立物流單</b><span>26 筆</span></div>
                  <div><b>宅配今日可出貨</b><span>16 筆</span></div>
                </div>
              </>
            )}

            {adminView === "inventory" && (
              <div className="data-table">
                {products.map((product) => (
                  <div key={product.id}>
                    <span>{product.title}</span>
                    <b>{product.stock} 件</b>
                    <button type="button">調整庫存</button>
                  </div>
                ))}
              </div>
            )}

            {adminView === "products" && (
              <div className="data-table">
                {products.map((product) => (
                  <div key={product.id}>
                    <span>{product.title}</span>
                    <b>{product.status}</b>
                    <button type="button">
                      {product.status === "下架" ? "上架" : "下架"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {adminView === "members" && (
              <div className="data-table">
                {members.map((member) => (
                  <div key={member.name}>
                    <span>{member.name} · {member.level}</span>
                    <b>{member.orders} 單 / ${member.spent.toLocaleString()}</b>
                    <button type="button">{member.status}</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="footer">
        <span>熊賀勝 Bear Toys</span>
        <a href="https://share.google/mqFr75x70keiNk2fB">高雄市三民區信國路 32 號</a>
        <a href="https://www.facebook.com/profile.php?id=100095394499752">
          Facebook 粉絲專頁
        </a>
      </footer>
    </main>
  );
}
