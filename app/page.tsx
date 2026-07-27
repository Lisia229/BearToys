"use client";

import { FormEvent, useMemo, useState } from "react";

type Page = "shop" | "product" | "favorites" | "checkout" | "guide" | "member" | "admin" | "about";
type ProductStatus = "現貨" | "預購" | "完售";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  status: ProductStatus;
  isNew: boolean;
  color: string;
  description: string;
  productInfo: string;
  shippingNote: string;
};

type User = {
  email: string;
  name: string;
  role: "member" | "admin";
  provider: "email" | "facebook" | "line";
};

const currency = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 0,
});

const products: Product[] = [
  {
    id: "bt-blind-dessert",
    name: "Pop Mart 熊系甜點派對盲盒",
    category: "盲盒",
    price: 390,
    stock: 48,
    sold: 126,
    status: "現貨",
    isNew: true,
    color: "#ffd47a",
    description: "單盒隨機出貨，整套可私訊確認。適合收藏、送禮，也能加購保護盒。",
    productInfo: "款式：隨機 1 入。材質：PVC / ABS。尺寸：約 7-9 公分。",
    shippingNote: "現貨商品付款完成後 1-3 個工作天安排出貨。",
  },
  {
    id: "bt-kuji-lucky",
    name: "熊賀勝限定幸運小賞組",
    category: "小賞",
    price: 99,
    stock: 120,
    sold: 390,
    status: "現貨",
    isNew: true,
    color: "#ff8a38",
    description: "每抽皆有賞，獎項包含吊飾、徽章、桌上小物與隱藏款。",
    productInfo: "下單後由系統保留抽賞資格，出貨前會更新抽中品項。",
    shippingNote: "可與其他現貨合併出貨，滿額享 7-11 免運活動。",
  },
  {
    id: "bt-naruto-acrylic",
    name: "NARUTO 壓克力立牌收藏組",
    category: "立牌",
    price: 580,
    stock: 22,
    sold: 65,
    status: "預購",
    isNew: false,
    color: "#618dd9",
    description: "日版預購商品，到貨後依訂單順序出貨。適合角色收藏展示。",
    productInfo: "內容：壓克力立牌 1 入。預購期約 2-5 週，實際依代理到貨為準。",
    shippingNote: "同單含預購商品時，會等預購到齊再一併出貨。",
  },
  {
    id: "bt-sanrio-charm",
    name: "三麗鷗角色吊飾隨機包",
    category: "吊飾",
    price: 199,
    stock: 76,
    sold: 211,
    status: "現貨",
    isNew: true,
    color: "#8ee0d7",
    description: "包包、鑰匙圈都可搭配的可愛吊飾，款式隨機。",
    productInfo: "內容：吊飾 1 入。尺寸：約 5 公分。款式不可挑。",
    shippingNote: "小物可與盲盒合併寄送，避免重複運費。",
  },
  {
    id: "bt-pokemon-figure",
    name: "寶可夢迷你公仔盲抽盒",
    category: "公仔",
    price: 320,
    stock: 54,
    sold: 173,
    status: "現貨",
    isNew: false,
    color: "#54bfa2",
    description: "迷你比例桌上公仔，適合辦公桌與展示櫃。",
    productInfo: "內容：公仔 1 入。外盒拆封後不接受因款式喜好退換。",
    shippingNote: "7-11 取貨與宅配皆可。",
  },
  {
    id: "bt-anime-kuji-a",
    name: "日版動漫小賞 A賞 景品套組",
    category: "一番賞",
    price: 680,
    stock: 18,
    sold: 84,
    status: "預購",
    isNew: true,
    color: "#e99bc6",
    description: "人氣動漫系列景品，數量有限，售完依補貨公告為準。",
    productInfo: "內容依當期小賞公告為準。預購商品需等待代理商到貨。",
    shippingNote: "預購追加期約 2-5 週，不含假日。",
  },
];

const guideTabs = [
  "購物常見問題",
  "會員常見問題",
  "售後服務問題",
  "服務條款",
  "隱私權保護",
  "165反詐騙",
];

const demoOrders = [
  { id: "B2026072701", date: "2026-07-27", total: 878, status: "待出貨", action: "申請退貨" },
  { id: "B2026071904", date: "2026-07-19", total: 1260, status: "已完成", action: "查看明細" },
];

export default function Home() {
  const [page, setPage] = useState<Page>("shop");
  const [category, setCategory] = useState("新品");
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(products[0].id);
  const [cart, setCart] = useState<Record<string, number>>({ "bt-blind-dessert": 1 });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register" | "verify">("login");
  const [user, setUser] = useState<User | null>(null);
  const [memberMenuOpen, setMemberMenuOpen] = useState(false);
  const [memberTab, setMemberTab] = useState("個人資料");
  const [guideTab, setGuideTab] = useState(guideTabs[0]);
  const [adminTab, setAdminTab] = useState("商品管理");
  const [shipping, setShipping] = useState("7-11 取貨");
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [toast, setToast] = useState("");

  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? products[0];
  const categories = ["新品", "所有商品", "盲盒", "小賞", "一番賞", "吊飾", "公仔", "立牌"];

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        category === "所有商品" ||
        (category === "新品" ? product.isNew : product.category === category);
      const matchesSearch = [product.name, product.category, product.description]
        .join(" ")
        .toLowerCase()
        .includes(keyword);
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const cartRows = Object.entries(cart)
    .map(([id, qty]) => {
      const product = products.find((item) => item.id === id);
      return product ? { product, qty } : null;
    })
    .filter(Boolean) as { product: Product; qty: number }[];

  const subtotal = cartRows.reduce((sum, row) => sum + row.product.price * row.qty, 0);
  const discount = appliedCoupon === "BEAR100" && subtotal >= 999 ? 100 : 0;
  const shippingFee = shipping === "宅配" ? 120 : subtotal >= 999 ? 0 : 60;
  const total = Math.max(0, subtotal - discount + shippingFee);

  function navigate(nextPage: Page, productId?: string) {
    if (productId) setSelectedProductId(productId);
    setPage(nextPage);
    setMemberMenuOpen(false);
    setSearchOpen(false);
  }

  function addToCart(productId: string) {
    setCart((current) => ({ ...current, [productId]: (current[productId] ?? 0) + 1 }));
    setToast("已加入購物車");
  }

  function toggleFavorite(productId: string) {
    setFavorites((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  }

  function login(role: "member" | "admin" = "member", provider: User["provider"] = "email") {
    setUser({
      email: role === "admin" ? "admin@bear-toys.test" : "member@bear-toys.test",
      name: role === "admin" ? "熊賀勝管理員" : "陳小熊",
      role,
      provider,
    });
    setAuthOpen(false);
    setToast(role === "admin" ? "已登入管理員示範帳號" : "已登入會員示範帳號");
  }

  function submitCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) {
      setAuthOpen(true);
      setAuthTab("login");
      setToast("請先登入會員再送出訂單");
      return;
    }
    setToast("訂單已建立，下一步會導向 Line Pay");
    setCart({});
    navigate("member");
    setMemberTab("訂單查詢/申請退貨");
  }

  function applyCoupon() {
    if (coupon.trim().toUpperCase() === "BEAR100" && subtotal >= 999) {
      setAppliedCoupon("BEAR100");
      setToast("折價券已套用");
      return;
    }
    setAppliedCoupon("");
    setToast("折價券需輸入 BEAR100 且商品滿 999 元");
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <div className="promo-bar">
          熊賀勝新品補貨中，滿 $999 享 7-11 免運，Line Pay 結帳開放測試
        </div>
        <div className="header-main">
          <button className="menu-toggle" type="button" aria-label="開啟選單" onClick={() => navigate("guide")}>
            <span />
            <span />
            <span />
          </button>

          <button className="brand" type="button" onClick={() => navigate("shop")} aria-label="熊賀勝首頁">
            <img src="/bear-toys-logo.png" alt="" />
            <span>
              <strong>熊賀勝</strong>
              <small>Bear Toys Select</small>
            </span>
          </button>

          <nav className="user-actions" aria-label="主要功能">
            <button className="icon-button" type="button" onClick={() => setSearchOpen(true)}>
              SEARCH
            </button>
            <button className="icon-button" type="button" onClick={() => navigate("favorites")}>
              收藏 {favorites.length}
            </button>
            <button className="icon-button" type="button" onClick={() => (user ? setMemberMenuOpen(!memberMenuOpen) : setAuthOpen(true))}>
              {user ? user.name : "登入"}
            </button>
            <button className="cart-pill" type="button" onClick={() => navigate("checkout")}>
              購物車 <strong>{cartRows.reduce((sum, row) => sum + row.qty, 0)}</strong>
            </button>
          </nav>
        </div>

        <nav className="category-tabs" aria-label="商品分類">
          {categories.map((item) => (
            <button
              className={`${category === item ? "active" : ""} ${item === "小賞" ? "highlight" : ""}`}
              key={item}
              type="button"
              onClick={() => {
                setCategory(item);
                navigate("shop");
              }}
            >
              {item}
            </button>
          ))}
        </nav>

        {searchOpen && (
          <section className="search-panel" aria-label="搜尋商品">
            <button className="search-close" type="button" aria-label="關閉搜尋" onClick={() => setSearchOpen(false)} />
            <label className="search-field">
              <span>SEARCH</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜尋盲盒、小賞、角色名..." autoFocus />
            </label>
            <div className="search-chips">
              {["盲盒", "小賞", "預購", "公仔", "吊飾", "NARUTO", "三麗鷗"].map((keyword) => (
                <button key={keyword} type="button" onClick={() => setSearch(keyword)}>
                  {keyword}
                </button>
              ))}
            </div>
          </section>
        )}

        {memberMenuOpen && user && (
          <section className="member-menu" aria-label="會員選單">
            {user.role === "admin" && <button type="button" onClick={() => navigate("admin")}>管理後台</button>}
            {["個人資料", "訂單查詢/申請退貨", "購物金", "折價券", "熊賀勝 points", "收藏清單"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setMemberTab(item);
                  navigate("member");
                }}
              >
                {item}
              </button>
            ))}
            <button type="button" onClick={() => setUser(null)}>登出</button>
          </section>
        )}
      </header>

      {page === "shop" && (
        <section className="page active">
          <div className="shop-hero">
            <div>
              <p className="eyebrow">Bear Toys Select</p>
              <h1>盲盒、小賞、預購商品一次逛</h1>
              <p>流程參考 7tiger：先逛商品、收藏喜歡款式，再進購物車完成 Line Pay 與 7-11 / 宅配配送資料。</p>
            </div>
            <div className="shop-card">
              <strong>高雄門市</strong>
              <span>807 高雄市三民區本安里信國路 32 號</span>
              <button type="button" onClick={() => navigate("guide")}>購買須知</button>
            </div>
          </div>
          <SectionHeading eyebrow={category} title={category === "新品" ? "NEWS" : category} note={`${filteredProducts.length} 件商品`} />
          <ProductGrid
            products={filteredProducts}
            favorites={favorites}
            onFavorite={toggleFavorite}
            onAdd={addToCart}
            onOpen={(productId) => navigate("product", productId)}
          />
        </section>
      )}

      {page === "product" && (
        <section className="page product-page">
          <button className="button ghost back-button" type="button" onClick={() => navigate("shop")}>返回商品列表</button>
          <div className="product-detail">
            <div className="product-gallery" style={{ background: selectedProduct.color }}>
              <span>{selectedProduct.status}</span>
              <strong>{selectedProduct.category}</strong>
            </div>
            <div className="product-info">
              <p className="eyebrow">{selectedProduct.category}</p>
              <h1>{selectedProduct.name}</h1>
              <p>{selectedProduct.description}</p>
              <strong className="detail-price">{currency.format(selectedProduct.price)}</strong>
              <div className="stock-row">
                <span>庫存 {selectedProduct.stock}</span>
                <span>已售 {selectedProduct.sold}</span>
                <span>{selectedProduct.status}</span>
              </div>
              <div className="detail-actions">
                <button className="button primary" type="button" onClick={() => addToCart(selectedProduct.id)}>加入購物車</button>
                <button className="button secondary" type="button" onClick={() => toggleFavorite(selectedProduct.id)}>
                  {favorites.includes(selectedProduct.id) ? "已收藏" : "加入收藏"}
                </button>
              </div>
              <details open>
                <summary>商品資訊</summary>
                <p>{selectedProduct.productInfo}</p>
              </details>
              <details>
                <summary>出貨說明</summary>
                <p>{selectedProduct.shippingNote}</p>
              </details>
            </div>
          </div>
          <SectionHeading eyebrow="You may also like" title="推薦商品" />
          <ProductGrid
            products={products.filter((product) => product.category === selectedProduct.category && product.id !== selectedProduct.id).concat(products.slice(0, 2)).slice(0, 4)}
            favorites={favorites}
            onFavorite={toggleFavorite}
            onAdd={addToCart}
            onOpen={(productId) => navigate("product", productId)}
          />
        </section>
      )}

      {page === "favorites" && (
        <section className="page page-narrow">
          <PageTitle eyebrow="My Bear List" title="我的最愛" text="收藏後可以在這裡快速加入購物車。" />
          <div className="collection-list">
            {favorites.length === 0 ? (
              <EmptyState text="目前沒有收藏商品。" action="去逛商品" onClick={() => navigate("shop")} />
            ) : (
              favorites.map((id) => {
                const product = products.find((item) => item.id === id);
                if (!product) return null;
                return (
                  <div className="list-row" key={id}>
                    <span>{product.name}</span>
                    <strong>{currency.format(product.price)}</strong>
                    <button type="button" onClick={() => addToCart(id)}>加入購物車</button>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {page === "checkout" && (
        <section className="page page-narrow">
          <PageTitle eyebrow="Checkout" title="結帳與出貨" text="付款方式以 Line Pay 為主，配送可選 7-11 取貨或宅配。" />
          <div className="checkout-layout">
            <section className="summary-section">
              <SectionHeading compact title="購物車" note={`${cartRows.length} 種商品`} />
              <div className="list">
                {cartRows.length === 0 ? (
                  <EmptyState text="購物車是空的。" action="回商品列表" onClick={() => navigate("shop")} />
                ) : (
                  cartRows.map(({ product, qty }) => (
                    <div className="cart-item" key={product.id}>
                      <span>{product.name}</span>
                      <div>
                        <button type="button" onClick={() => setCart((current) => ({ ...current, [product.id]: Math.max(1, qty - 1) }))}>-</button>
                        <strong>{qty}</strong>
                        <button type="button" onClick={() => addToCart(product.id)}>+</button>
                      </div>
                      <b>{currency.format(product.price * qty)}</b>
                    </div>
                  ))
                )}
              </div>
              <div className="coupon-row">
                <input value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="輸入折價券代碼 BEAR100" />
                <button className="button secondary" type="button" onClick={applyCoupon}>套用</button>
              </div>
              <dl className="totals">
                <div><dt>商品小計</dt><dd>{currency.format(subtotal)}</dd></div>
                {discount > 0 && <div><dt>折價券折抵</dt><dd>-{currency.format(discount)}</dd></div>}
                <div><dt>運費</dt><dd>{currency.format(shippingFee)}</dd></div>
                <div className="grand-total"><dt>總計</dt><dd>{currency.format(total)}</dd></div>
              </dl>
            </section>
            <form className="checkout-form" onSubmit={submitCheckout}>
              <h2>收件資料</h2>
              <label>收件人<input required placeholder="王小明" /></label>
              <label>手機<input required placeholder="0912-345-678" /></label>
              <label>
                出貨方式
                <select value={shipping} onChange={(event) => setShipping(event.target.value)}>
                  <option>7-11 取貨</option>
                  <option>宅配</option>
                </select>
              </label>
              <label>
                {shipping === "宅配" ? "宅配地址" : "指定取貨門市"}
                <input required placeholder={shipping === "宅配" ? "請輸入完整地址" : "請輸入 7-11 門市名稱"} />
              </label>
              <div className="payment-choice">
                <span>付款方式</span>
                <strong>Line Pay</strong>
                <p>正式上線時會建立 Line Pay 付款請求並導回訂單完成頁。</p>
              </div>
              <button className="button primary" type="submit">送出訂單 / 前往 Line Pay</button>
            </form>
          </div>
        </section>
      )}

      {page === "guide" && (
        <section className="page page-narrow">
          <PageTitle eyebrow="Shopping Guide" title="購買須知" text="依 7tiger 的客服頁流程，分成購物、會員、售後、條款、隱私與反詐騙。" />
          <div className="guide-panel">
            <aside className="guide-sidebar">
              <h2>CUSTOMER SERVICE/</h2>
              {guideTabs.map((tab) => (
                <button className={guideTab === tab ? "active" : ""} key={tab} type="button" onClick={() => setGuideTab(tab)}>{tab}</button>
              ))}
            </aside>
            <div className="guide-content">
              <GuideContent tab={guideTab} />
            </div>
          </div>
        </section>
      )}

      {page === "about" && (
        <section className="page page-narrow">
          <PageTitle eyebrow="About Bear Toys" title="關於熊賀勝" text="高雄三民區實體玩具店，提供盲盒、小賞、預購與收藏玩具。" />
          <div className="story-panel">
            <img src="/og.png" alt="熊賀勝品牌圖" />
            <div>
              <h2>選品、出貨、服務都用心</h2>
              <p>可以來門市逛逛，也可以在線上先收藏喜歡的款式。新品、抽賞公告與活動會同步更新。</p>
            </div>
          </div>
        </section>
      )}

      {page === "member" && (
        <section className="page member-page">
          {!user ? (
            <div className="locked-panel">
              <p className="eyebrow">Member only</p>
              <h1>請先登入會員</h1>
              <button className="button primary" type="button" onClick={() => setAuthOpen(true)}>登入 / 註冊</button>
            </div>
          ) : (
            <>
              <div className="member-header">
                <h1>我的會員中心</h1>
                <button className="button ghost" type="button" onClick={() => setUser(null)}>登出</button>
              </div>
              <nav className="member-tabs">
                {["個人資料", "訂單查詢/申請退貨", "購物金", "折價券", "熊賀勝 points", "收藏清單"].map((tab) => (
                  <button className={memberTab === tab ? "active" : ""} key={tab} type="button" onClick={() => setMemberTab(tab)}>{tab}</button>
                ))}
              </nav>
              <MemberPanel tab={memberTab} user={user} favorites={favorites} orders={demoOrders} />
            </>
          )}
        </section>
      )}

      {page === "admin" && (
        <section className="page">
          {user?.role !== "admin" ? (
            <div className="locked-panel">
              <p className="eyebrow">Admin only</p>
              <h1>管理後台只開放管理員查看</h1>
              <p>示範帳號：admin@bear-toys.test / admin123</p>
              <button className="button primary" type="button" onClick={() => login("admin")}>登入管理員</button>
            </div>
          ) : (
            <>
              <SectionHeading eyebrow="Admin Dashboard" title="管理後台" note="僅管理員可見" />
              <div className="admin-grid">
                <Metric label="本月營收" value={currency.format(184200)} />
                <Metric label="訂單數" value="326" />
                <Metric label="售出件數" value="812" />
                <Metric label="熱銷類型" value="小賞" />
              </div>
              <div className="admin-workspace">
                <form className="admin-form">
                  <SectionHeading compact title="新增商品" />
                  <label>商品名稱<input placeholder="例：新款角色盲盒" /></label>
                  <label>分類<select><option>盲盒</option><option>小賞</option><option>公仔</option><option>吊飾</option></select></label>
                  <label>價格<input type="number" placeholder="390" /></label>
                  <label>庫存<input type="number" placeholder="24" /></label>
                  <label>商品描述<textarea rows={4} placeholder="商品內容、預購期、注意事項" /></label>
                  <button className="button primary" type="button">新增到賣場</button>
                </form>
                <section className="admin-side">
                  <nav className="admin-side-tabs">
                    {["商品管理", "近期訂單", "會員管理", "公告", "折價券"].map((tab) => (
                      <button className={adminTab === tab ? "active" : ""} key={tab} type="button" onClick={() => setAdminTab(tab)}>{tab}</button>
                    ))}
                  </nav>
                  <AdminPanel tab={adminTab} />
                </section>
              </div>
            </>
          )}
        </section>
      )}

      <footer className="site-footer">
        <section>
          <h2>ABOUT</h2>
          <button type="button" onClick={() => navigate("about")}>品牌介紹</button>
          <button type="button" onClick={() => navigate("guide")}>購買須知</button>
          <button type="button" onClick={() => navigate("shop")}>最新消息</button>
        </section>
        <section>
          <h2>CUSTOMER SERVICE</h2>
          {guideTabs.slice(0, 4).map((tab) => (
            <button key={tab} type="button" onClick={() => { setGuideTab(tab); navigate("guide"); }}>{tab}</button>
          ))}
        </section>
        <section>
          <h2>FOLLOW US</h2>
          <a href="https://www.facebook.com/profile.php?id=100095394499752">Facebook</a>
          <a href="https://share.google/mqFr75x70keiNk2fB">Google Map</a>
        </section>
        <section>
          <h2>NEWS LETTER</h2>
          <label className="newsletter-form">
            <input type="email" placeholder="輸入 email 訂閱新品公告" />
            <button type="button">→</button>
          </label>
          <p>807 高雄市三民區信國路 32 號</p>
        </section>
      </footer>

      {authOpen && (
        <div className="dialog-backdrop" role="presentation">
          <section className="auth-dialog" role="dialog" aria-modal="true" aria-label="會員登入與註冊">
            <button className="dialog-close" type="button" onClick={() => setAuthOpen(false)}>×</button>
            <div className="auth-tabs">
              <button className={authTab === "login" ? "active" : ""} type="button" onClick={() => setAuthTab("login")}>會員登入</button>
              <button className={authTab === "register" ? "active" : ""} type="button" onClick={() => setAuthTab("register")}>加入會員</button>
            </div>
            {authTab === "login" && (
              <div className="auth-panel">
                <h2>快速登入結帳</h2>
                <div className="social-login">
                  <button type="button" onClick={() => login("member", "line")}>LINE 登入</button>
                  <button type="button" onClick={() => login("member", "facebook")}>FACEBOOK 登入</button>
                </div>
                <input type="email" placeholder="Email Address / Account 會員帳號" />
                <input type="password" placeholder="Password 會員密碼" />
                <button className="auth-submit" type="button" onClick={() => login("member")}>登入會員</button>
                <button className="auth-demo" type="button" onClick={() => login("admin")}>用管理員示範帳號登入</button>
              </div>
            )}
            {authTab === "register" && (
              <div className="auth-panel">
                <h2>快速加入會員</h2>
                <div className="social-login">
                  <button type="button" onClick={() => login("member", "line")}>LINE 註冊即送購物金</button>
                  <button type="button" onClick={() => login("member", "facebook")}>FACEBOOK 註冊登入</button>
                </div>
                <input type="email" placeholder="Email Address 電子信箱" />
                <input type="password" placeholder="Password 會員密碼" />
                <input type="password" placeholder="再次輸入密碼" />
                <button className="auth-submit" type="button" onClick={() => setAuthTab("verify")}>註冊會員</button>
              </div>
            )}
            {authTab === "verify" && (
              <div className="auth-panel verify-panel">
                <h2>驗證您的信箱</h2>
                <p>驗證信已寄出。正式串接後會由後端寄送驗證信並啟用帳號。</p>
                <button className="auth-submit" type="button" onClick={() => login("member")}>完成示範驗證</button>
              </div>
            )}
          </section>
        </div>
      )}

      {toast && (
        <button className="toast" type="button" onClick={() => setToast("")}>
          {toast}
        </button>
      )}
    </main>
  );
}

function SectionHeading({ eyebrow, title, note, compact = false }: { eyebrow?: string; title: string; note?: string; compact?: boolean }) {
  return (
    <div className={`section-heading ${compact ? "compact" : ""}`}>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {note && <span>{note}</span>}
    </div>
  );
}

function PageTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="page-title">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{text}</p>
    </div>
  );
}

function ProductGrid({ products, favorites, onFavorite, onAdd, onOpen }: { products: Product[]; favorites: string[]; onFavorite: (id: string) => void; onAdd: (id: string) => void; onOpen: (id: string) => void }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <article className="product-card" key={product.id}>
          <button className="product-image" style={{ background: product.color }} type="button" onClick={() => onOpen(product.id)}>
            <span>{product.status}</span>
            <b>{product.category}</b>
          </button>
          <div className="product-body">
            <p>{product.category}</p>
            <h3>{product.name}</h3>
            <div className="product-meta">
              <strong>{currency.format(product.price)}</strong>
              <span>已售 {product.sold}</span>
            </div>
            <div className="product-actions">
              <button type="button" onClick={() => onFavorite(product.id)}>
                {favorites.includes(product.id) ? "已收藏" : "收藏"}
              </button>
              <button type="button" onClick={() => onAdd(product.id)}>加入購物車</button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function EmptyState({ text, action, onClick }: { text: string; action: string; onClick: () => void }) {
  return (
    <div className="empty-state">
      <p>{text}</p>
      <button className="button secondary" type="button" onClick={onClick}>{action}</button>
    </div>
  );
}

function GuideContent({ tab }: { tab: string }) {
  if (tab === "購物常見問題") {
    return (
      <div className="guide-accordion">
        <details open><summary>下單須知</summary><ol><li>請確認商品、數量、預購期與配送方式後再送出訂單。</li><li>同單含預購商品時，會等預購到齊再出貨。</li><li>商品外盒運送壓痕非重大瑕疵，完美盒況請先詢問客服。</li></ol></details>
        <details><summary>付款方式</summary><p>目前主流程為 Line Pay。正式上線後會導向 Line Pay 授權付款並回寫付款狀態。</p></details>
        <details><summary>送貨方式</summary><p>支援 7-11 取貨與宅配。7-11 到貨後請於期限內取貨，未取可能需補運費重新寄出。</p></details>
      </div>
    );
  }
  if (tab === "會員常見問題") {
    return <div className="guide-prose"><p>完成 E-mail、Facebook 或 LINE 登入後即可成為會員。會員中心可修改個人資料、查看訂單、申請退貨、管理收藏、查詢折價券與 points。</p></div>;
  }
  if (tab === "售後服務問題") {
    return <div className="guide-prose"><p>收到商品後 7 日內如有瑕疵，請至會員中心訂單查詢申請售後，並提供訂單編號、瑕疵照片與聯絡方式。</p></div>;
  }
  if (tab === "165反詐騙") {
    return <div className="guide-prose"><p>熊賀勝不會電話要求您操作 ATM、解除分期或提供信用卡資料。若接到可疑電話，請撥打 165 查證。</p></div>;
  }
  return <div className="guide-prose"><p>{tab}內容會於正式上線前依商店政策補齊。</p></div>;
}

function MemberPanel({ tab, user, favorites, orders }: { tab: string; user: User; favorites: string[]; orders: typeof demoOrders }) {
  if (tab === "個人資料") {
    return (
      <div className="member-content-grid">
        <section className="member-panel">
          <SectionHeading compact title="修改會員資料" />
          <div className="member-form-grid">
            <label>姓名<input defaultValue={user.name} /></label>
            <label>Email<input defaultValue={user.email} /></label>
            <label>手機<input defaultValue="0912-345-678" /></label>
            <label>常用 7-11 門市<input defaultValue="高雄信國門市" /></label>
            <label className="wide-field">宅配地址<input defaultValue="高雄市三民區信國路 32 號" /></label>
          </div>
        </section>
        <section className="member-panel">
          <SectionHeading compact title="修改密碼" />
          <div className="member-form-grid">
            <label>新密碼<input type="password" placeholder="6 碼以上英數字" /></label>
            <label>確認新密碼<input type="password" placeholder="再次輸入新密碼" /></label>
          </div>
        </section>
      </div>
    );
  }
  if (tab === "訂單查詢/申請退貨") {
    return (
      <section className="member-panel">
        <h2>訂單查詢/申請退貨</h2>
        {orders.map((order) => (
          <div className="list-row" key={order.id}>
            <span>{order.id} · {order.date}</span>
            <strong>{currency.format(order.total)} / {order.status}</strong>
            <button type="button">{order.action}</button>
          </div>
        ))}
      </section>
    );
  }
  if (tab === "收藏清單") {
    return <section className="member-panel"><h2>收藏清單</h2><p>目前收藏 {favorites.length} 件商品。</p></section>;
  }
  return <section className="member-panel"><h2>{tab}</h2><p>目前無可用資料。</p></section>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <article className="metric"><span>{label}</span><strong>{value}</strong></article>;
}

function AdminPanel({ tab }: { tab: string }) {
  const rows = tab === "商品管理"
    ? products.map((product) => [product.name, `${product.stock} 件`, product.status])
    : tab === "近期訂單"
      ? demoOrders.map((order) => [order.id, currency.format(order.total), order.status])
      : tab === "會員管理"
        ? [["陳小熊", "金熊會員", "正常"], ["林美美", "銀熊會員", "正常"], ["王阿勝", "新會員", "需驗證"]]
        : tab === "折價券"
          ? [["BEAR100", "滿 999 折 100", "啟用中"]]
          : [["跑馬燈公告", "滿 999 免運", "顯示中"]];
  return (
    <div className="admin-list">
      <h2>{tab}</h2>
      {rows.map((row) => (
        <div className="list-row" key={row.join("-")}>
          <span>{row[0]}</span>
          <strong>{row[1]}</strong>
          <button type="button">{row[2]}</button>
        </div>
      ))}
    </div>
  );
}
