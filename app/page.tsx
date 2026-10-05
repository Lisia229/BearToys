"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

type Page = "shop" | "product" | "favorites" | "checkout" | "guide" | "member" | "admin" | "about";
type ProductStatus = "現貨" | "預購" | "完售";
type OrderStatus = "待付款" | "待出貨" | "已出貨" | "已完成" | "取消申請中" | "已取消";

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
  image?: string;
  description: string;
  productInfo: string;
  shippingNote: string;
};

type Order = {
  id: string;
  date: string;
  receiver: string;
  phone: string;
  shipping: string;
  address: string;
  payment: string;
  total: number;
  status: OrderStatus;
  items: { productName: string; qty: number; price: number }[];
};

type ProductDraft = {
  name: string;
  category: string;
  price: string;
  stock: string;
  status: ProductStatus;
  image: string;
  description: string;
};

type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  level: string;
  spent: number;
  orders: number;
  status: string;
  address: string;
  joinedAt: string;
};

type CouponStatus = "啟用中" | "停用";
type CouponDraft = {
  code: string;
  title: string;
  type: "fixed" | "percent";
  value: string;
  minOrder: string;
  expiresAt: string;
  status: CouponStatus;
};
type Coupon = Omit<CouponDraft, "value" | "minOrder"> & {
  id: string;
  value: number;
  minOrder: number;
};

type AnnouncementStatus = "顯示中" | "隱藏";
type AnnouncementDraft = {
  title: string;
  content: string;
  status: AnnouncementStatus;
};
type Announcement = AnnouncementDraft & {
  id: string;
  updatedAt: string;
};

type User = {
  email: string;
  name: string;
  role: "member" | "admin";
  provider: "email" | "facebook";
};

const currency = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 0,
});

const initialProducts: Product[] = [
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

const demoOrders: Order[] = [
  {
    id: "B2026072701",
    date: "2026-07-27",
    receiver: "陳小熊",
    phone: "0912-345-678",
    shipping: "7-11 取貨",
    address: "高雄信國門市",
    payment: "Line Pay",
    total: 878,
    status: "待出貨",
    items: [
      { productName: "Pop Mart 熊系甜點派對盲盒", qty: 2, price: 390 },
      { productName: "熊賀勝限定幸運小賞組", qty: 1, price: 99 },
    ],
  },
  {
    id: "B2026071904",
    date: "2026-07-19",
    receiver: "陳小熊",
    phone: "0912-345-678",
    shipping: "宅配",
    address: "高雄市三民區信國路 32 號",
    payment: "Line Pay",
    total: 1260,
    status: "已完成",
    items: [
      { productName: "寶可夢迷你公仔盲抽盒", qty: 2, price: 320 },
      { productName: "NARUTO 壓克力立牌收藏組", qty: 1, price: 580 },
    ],
  },
];

const emptyProductDraft: ProductDraft = {
  name: "",
  category: "盲盒",
  price: "",
  stock: "",
  status: "現貨",
  image: "",
  description: "",
};

function productToDraft(product: Product): ProductDraft {
  return {
    name: product.name,
    category: product.category,
    price: String(product.price),
    stock: String(product.stock),
    status: product.status,
    image: product.image ?? "",
    description: product.description,
  };
}

const initialMembers: Member[] = [
  {
    id: "m-bear-001",
    name: "陳小熊",
    email: "member@bear-toys.test",
    phone: "0912-345-678",
    level: "金熊會員",
    spent: 23880,
    orders: 18,
    status: "正常",
    address: "高雄市三民區信國路 32 號",
    joinedAt: "2025-11-08",
  },
  {
    id: "m-bear-002",
    name: "林美美",
    email: "meimei@example.com",
    phone: "0922-800-168",
    level: "銀熊會員",
    spent: 8640,
    orders: 7,
    status: "正常",
    address: "高雄市左營區自由二路 88 號",
    joinedAt: "2026-02-14",
  },
  {
    id: "m-bear-003",
    name: "王阿勝",
    email: "sheng@example.com",
    phone: "0933-776-520",
    level: "新會員",
    spent: 990,
    orders: 1,
    status: "需驗證",
    address: "尚未填寫",
    joinedAt: "2026-07-20",
  },
];

const initialCoupons: Coupon[] = [
  {
    id: "coupon-bear100",
    code: "BEAR100",
    title: "滿 999 折 100",
    type: "fixed",
    value: 100,
    minOrder: 999,
    expiresAt: "2026-12-31",
    status: "啟用中",
  },
];

const initialAnnouncements: Announcement[] = [
  {
    id: "announce-free-shipping",
    title: "跑馬燈公告",
    content: "滿 999 享 7-11 免運，新品補貨會同步公告。",
    status: "顯示中",
    updatedAt: "2026-07-27",
  },
];

const emptyCouponDraft: CouponDraft = {
  code: "",
  title: "",
  type: "fixed",
  value: "",
  minOrder: "",
  expiresAt: "",
  status: "啟用中",
};

const emptyAnnouncementDraft: AnnouncementDraft = {
  title: "",
  content: "",
  status: "顯示中",
};

function couponToDraft(coupon: Coupon): CouponDraft {
  return {
    code: coupon.code,
    title: coupon.title,
    type: coupon.type,
    value: String(coupon.value),
    minOrder: String(coupon.minOrder),
    expiresAt: coupon.expiresAt,
    status: coupon.status,
  };
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [page, setPage] = useState<Page>("shop");
  const [category, setCategory] = useState("新品");
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(initialProducts[0].id);
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
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productDraft, setProductDraft] = useState<ProductDraft>(emptyProductDraft);

  useEffect(() => {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      root.style.scrollBehavior = previousScrollBehavior;
    });
    return () => {
      window.cancelAnimationFrame(frame);
      root.style.scrollBehavior = previousScrollBehavior;
    };
  }, [page, selectedProductId]);

  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? products[0];
  const categories = ["新品", "所有商品", "盲盒", "小賞", "一番賞", "吊飾", "公仔", "立牌"];
  const activeAnnouncements = announcements.filter((announcement) => announcement.status === "顯示中");
  const cancelRequestCount = orders.filter((order) => order.status === "取消申請中").length;

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
  }, [category, products, search]);

  const searchResults = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return products.slice(0, 6);
    return products.filter((product) =>
      [product.name, product.category, product.description, product.status]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [products, search]);

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

  function goHome() {
    setCategory("新品");
    navigate("shop");
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

  function editProduct(product: Product) {
    setEditingProductId(product.id);
    setProductDraft(productToDraft(product));
    setAdminTab("商品管理");
    setToast(`正在編輯：${product.name}`);
  }

  function cancelProductEdit() {
    setEditingProductId(null);
    setProductDraft(emptyProductDraft);
  }

  function submitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const price = Number(productDraft.price);
    const stock = Number(productDraft.stock);
    if (!productDraft.name.trim() || !price || Number.isNaN(stock)) {
      setToast("請填寫商品名稱、價格與庫存");
      return;
    }

    if (editingProductId) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingProductId
            ? {
                ...product,
                name: productDraft.name.trim(),
                category: productDraft.category,
                price,
                stock,
                status: productDraft.status,
                image: productDraft.image || undefined,
                description: productDraft.description.trim() || product.description,
                productInfo: productDraft.description.trim() || product.productInfo,
              }
            : product
        )
      );
      setToast("商品已更新");
    } else {
      const newProduct: Product = {
        id: `bt-custom-${Date.now()}`,
        name: productDraft.name.trim(),
        category: productDraft.category,
        price,
        stock,
        sold: 0,
        status: productDraft.status,
        isNew: true,
        color: "#f2a65a",
        image: productDraft.image || undefined,
        description: productDraft.description.trim() || "商品內容、預購期與注意事項待補。",
        productInfo: productDraft.description.trim() || "商品資訊待補。",
        shippingNote: productDraft.status === "預購" ? "預購商品依到貨順序出貨。" : "現貨商品付款完成後安排出貨。",
      };
      setProducts((current) => [newProduct, ...current]);
      setToast("商品已新增到賣場");
    }

    setEditingProductId(null);
    setProductDraft(emptyProductDraft);
  }

  function handleProductImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setToast("請上傳圖片檔");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProductDraft((draft) => ({ ...draft, image: String(reader.result) }));
      setToast("商品圖片已加入預覽");
    };
    reader.readAsDataURL(file);
  }

  function updateProductStatus(productId: string) {
    const nextStatus: Record<ProductStatus, ProductStatus> = {
      現貨: "預購",
      預購: "完售",
      完售: "現貨",
    };
    setProducts((current) =>
      current.map((product) =>
        product.id === productId ? { ...product, status: nextStatus[product.status] } : product
      )
    );
  }

  function requestCancelOrder(orderId: string) {
    setOrders((current) =>
      current.map((order) =>
        (order.status === "待出貨" || order.status === "待付款") && order.id === orderId
          ? { ...order, status: "取消申請中" }
          : order
      )
    );
    setToast("已送出取消申請，等待管理員確認");
  }

  function updateOrderStatus(orderId: string, status: OrderStatus) {
    setOrders((current) =>
      current.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
    setToast(status === "已取消" ? "訂單已確認取消" : "訂單狀態已更新");
  }

  function saveCoupon(draft: CouponDraft, editingId: string | null) {
    const value = Number(draft.value);
    const minOrder = Number(draft.minOrder);
    if (!draft.code.trim() || !draft.title.trim() || !value || Number.isNaN(minOrder)) {
      setToast("請填寫折價券代碼、名稱與折抵條件");
      return false;
    }

    const nextCoupon: Coupon = {
      id: editingId ?? `coupon-${Date.now()}`,
      code: draft.code.trim().toUpperCase(),
      title: draft.title.trim(),
      type: draft.type,
      value,
      minOrder,
      expiresAt: draft.expiresAt || "未設定",
      status: draft.status,
    };

    setCoupons((current) =>
      editingId
        ? current.map((couponItem) => (couponItem.id === editingId ? nextCoupon : couponItem))
        : [nextCoupon, ...current]
    );
    setToast(editingId ? "折價券已更新" : "折價券已新增");
    return true;
  }

  function saveAnnouncement(draft: AnnouncementDraft, editingId: string | null) {
    if (!draft.title.trim() || !draft.content.trim()) {
      setToast("請填寫公告標題與內容");
      return false;
    }

    const nextAnnouncement: Announcement = {
      id: editingId ?? `announcement-${Date.now()}`,
      title: draft.title.trim(),
      content: draft.content.trim(),
      status: draft.status,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    setAnnouncements((current) =>
      editingId
        ? current.map((announcement) => (announcement.id === editingId ? nextAnnouncement : announcement))
        : [nextAnnouncement, ...current]
    );
    setToast(editingId ? "公告已更新" : "公告已新增");
    return true;
  }

  function updateMemberLevel(memberId: string, level: string) {
    setMembers((current) =>
      current.map((member) => (member.id === memberId ? { ...member, level } : member))
    );
    setToast("會員等級已更新");
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <div className="promo-bar" aria-label="商店公告">
          <div className="marquee-track">
            {[...activeAnnouncements, ...activeAnnouncements].map((announcement, index) => (
              <span key={`${announcement.id}-${index}`}>{announcement.content}</span>
            ))}
            {activeAnnouncements.length === 0 && <span>熊賀勝新品補貨中，滿 $999 享 7-11 免運</span>}
          </div>
        </div>
        <div className="header-main">
          <button className="brand" type="button" onClick={goHome} aria-label="熊賀勝首頁">
            <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/bear-toys-logo.png`} alt="" />
            <span>
              <strong>熊賀勝</strong>
              <small>Bear Toys Select</small>
            </span>
          </button>

        </div>

        <nav className="category-tabs" aria-label="商品分類">
          {categories.map((item) => (
            <button
              className={category === item ? "active" : ""}
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
          <section className="search-panel" role="dialog" aria-modal="true" aria-label="搜尋商品">
            <div className="search-panel-inner">
              <header className="search-panel-head">
                <button className="search-brand" type="button" onClick={goHome} aria-label="回到熊賀勝首頁">
                  <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/bear-toys-logo.png`} alt="" />
                  <span><strong>熊賀勝</strong><small>SEARCH STORE</small></span>
                </button>
                <button className="search-close" type="button" aria-label="關閉搜尋" onClick={() => setSearchOpen(false)} />
              </header>
              <div className="search-intro">
                <p className="eyebrow">FIND YOUR FAVORITE</p>
                <h2>今天想收藏什麼？</h2>
              </div>
              <label className="search-field">
                <span>SEARCH</span>
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜尋商品、角色或分類" autoFocus />
                {search && <button type="button" onClick={() => setSearch("")} aria-label="清除搜尋">清除</button>}
              </label>
              <div className="search-chips" aria-label="熱門搜尋">
                {["盲盒", "小賞", "預購", "公仔", "吊飾", "NARUTO", "三麗鷗"].map((keyword) => (
                  <button className={search === keyword ? "active" : ""} key={keyword} type="button" onClick={() => setSearch(keyword)}>
                    {keyword}
                  </button>
                ))}
              </div>
              <div className="search-result-heading">
                <div>
                  <p className="eyebrow">{search ? "SEARCH RESULTS" : "POPULAR NOW"}</p>
                  <h3>{search ? `「${search}」的搜尋結果` : "熱門商品"}</h3>
                </div>
                <span>{searchResults.length} 件商品</span>
              </div>
              {searchResults.length > 0 ? (
                <div className="search-results">
                  {searchResults.map((product) => (
                    <button className="search-result-card" type="button" key={product.id} onClick={() => navigate("product", product.id)}>
                      <span className={`search-result-image ${product.image ? "has-image" : ""}`} style={{ background: product.image ? undefined : product.color }}>
                        {product.image && <img src={product.image} alt="" />}
                        <b>{product.status}</b>
                      </span>
                      <span className="search-result-copy">
                        <small>{product.category}</small>
                        <strong>{product.name}</strong>
                        <span><b>{currency.format(product.price)}</b><i>庫存 {product.stock}</i></span>
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="search-empty">
                  <strong>沒有找到符合的商品</strong>
                  <span>換個角色名稱、分類或較短的關鍵字試試看。</span>
                  <button type="button" onClick={() => setSearch("")}>查看熱門商品</button>
                </div>
              )}
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
          {category === "新品" && (
            <>
              <div className="shop-hero-wrap">
                <div className="shop-hero">
              <div className="hero-visual">
                <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/og.png`} alt="熊賀勝本週精選玩具" />
                <span className="hero-badge">本週精選</span>
              </div>
              <div className="hero-copy">
                <p className="eyebrow">BEAR TOYS PICK</p>
                <h1>把喜歡的角色<br />帶回收藏櫃</h1>
                <p>盲盒、小賞、日版預購一次逛。現貨快速出貨，也能選擇 7-11 取貨或宅配。</p>
                <div className="hero-feature">
                  <span>人氣推薦</span>
                  <strong>熊賀勝限定幸運小賞組</strong>
                </div>
                <div className="hero-cta-row">
                  <button className="button primary" type="button" onClick={() => setCategory("小賞")}>立即選購</button>
                  <button className="button hero-secondary" type="button" onClick={() => navigate("guide")}>購買須知</button>
                </div>
              </div>
            </div>
            <aside className="shop-quick-panel" aria-label="購物快捷功能">
              <p className="eyebrow">TODAY AT BEAR TOYS</p>
              <h2>今天想找什麼？</h2>
              <div className="quick-grid">
                <button
                  type="button"
                  onClick={() => document.getElementById("latest-products")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                >
                  <b>NEW</b><span>新品到貨</span>
                </button>
                <button type="button" onClick={() => setCategory("小賞")}><b>LUCKY</b><span>熱門小賞</span></button>
                <button type="button" onClick={() => navigate("favorites")}><b>LOVE</b><span>我的收藏</span></button>
                <button type="button" onClick={() => navigate("member")}><b>MEMBER</b><span>訂單查詢</span></button>
              </div>
              <button className="store-link" type="button" onClick={() => navigate("about")}>
                <span>高雄實體門市</span>
                <strong>信國路 32 號 →</strong>
              </button>
                </aside>
              </div>
              <div className="trust-strip">
                <span><b>01</b> 精選正版玩具</span>
                <span><b>02</b> 現貨快速出貨</span>
                <span><b>03</b> 7-11／宅配</span>
                <span><b>04</b> 會員訂單追蹤</span>
              </div>
            </>
          )}
          <div className="shop-section-head" id="latest-products">
            <div>
              <p className="eyebrow">EXPLORE THE COLLECTION</p>
              <h2>{category === "新品" ? "最新上架" : category}</h2>
            </div>
            <span>共 {filteredProducts.length} 件商品</span>
          </div>
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
            <div
              className={`product-gallery ${selectedProduct.image ? "has-upload" : ""}`}
              style={{ background: selectedProduct.image ? undefined : selectedProduct.color }}
            >
              {selectedProduct.image && <img src={selectedProduct.image} alt={selectedProduct.name} />}
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
            <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/og.png`} alt="熊賀勝品牌圖" />
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
              <MemberPanel
                tab={memberTab}
                user={user}
                favorites={favorites}
                orders={orders}
                onCancelOrder={requestCancelOrder}
              />
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
                <Metric label="取消申請" value={`${cancelRequestCount} 筆`} />
              </div>
              <div className="admin-workspace">
                <form className="admin-form" onSubmit={submitProduct}>
                  <SectionHeading compact title={editingProductId ? "編輯商品" : "新增商品"} />
                  {editingProductId && (
                    <p className="form-hint">正在編輯商品。儲存後會同步更新前台商品列表。</p>
                  )}
                  <label>
                    商品名稱
                    <input
                      value={productDraft.name}
                      onChange={(event) => setProductDraft((draft) => ({ ...draft, name: event.target.value }))}
                      placeholder="例：新款角色盲盒"
                    />
                  </label>
                  <label>
                    分類
                    <select
                      value={productDraft.category}
                      onChange={(event) => setProductDraft((draft) => ({ ...draft, category: event.target.value }))}
                    >
                      <option>盲盒</option>
                      <option>小賞</option>
                      <option>一番賞</option>
                      <option>公仔</option>
                      <option>吊飾</option>
                      <option>立牌</option>
                    </select>
                  </label>
                  <label>
                    商品狀態
                    <select
                      value={productDraft.status}
                      onChange={(event) => setProductDraft((draft) => ({ ...draft, status: event.target.value as ProductStatus }))}
                    >
                      <option>現貨</option>
                      <option>預購</option>
                      <option>完售</option>
                    </select>
                  </label>
                  <label>
                    價格
                    <input
                      type="number"
                      min="1"
                      value={productDraft.price}
                      onChange={(event) => setProductDraft((draft) => ({ ...draft, price: event.target.value }))}
                      placeholder="390"
                    />
                  </label>
                  <label>
                    庫存
                    <input
                      type="number"
                      min="0"
                      value={productDraft.stock}
                      onChange={(event) => setProductDraft((draft) => ({ ...draft, stock: event.target.value }))}
                      placeholder="24"
                    />
                  </label>
                  <label>
                    商品描述
                    <textarea
                      rows={4}
                      value={productDraft.description}
                      onChange={(event) => setProductDraft((draft) => ({ ...draft, description: event.target.value }))}
                      placeholder="商品內容、預購期、注意事項"
                    />
                  </label>
                  <label>
                    商品圖片
                    <input type="file" accept="image/*" onChange={handleProductImageUpload} />
                  </label>
                  {productDraft.image && (
                    <div className="image-preview">
                      <img src={productDraft.image} alt="商品圖片預覽" />
                      <button
                        className="button ghost"
                        type="button"
                        onClick={() => setProductDraft((draft) => ({ ...draft, image: "" }))}
                      >
                        移除圖片
                      </button>
                    </div>
                  )}
                  <div className="form-actions">
                    <button className="button primary" type="submit">
                      {editingProductId ? "儲存商品" : "新增到賣場"}
                    </button>
                    {editingProductId && (
                      <button className="button ghost" type="button" onClick={cancelProductEdit}>
                        取消編輯
                      </button>
                    )}
                  </div>
                </form>
                <section className="admin-side">
                  <nav className="admin-side-tabs">
                    {["商品管理", "近期訂單", "會員管理", "公告", "折價券"].map((tab) => (
                      <button className={adminTab === tab ? "active" : ""} key={tab} type="button" onClick={() => setAdminTab(tab)}>{tab}</button>
                    ))}
                  </nav>
                  <AdminPanel
                    tab={adminTab}
                    products={products}
                    orders={orders}
                    members={members}
                    coupons={coupons}
                    announcements={announcements}
                    onEditProduct={editProduct}
                    onCycleProductStatus={updateProductStatus}
                    onSaveCoupon={saveCoupon}
                    onSaveAnnouncement={saveAnnouncement}
                    onUpdateMemberLevel={updateMemberLevel}
                    onUpdateOrderStatus={updateOrderStatus}
                  />
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

      {!searchOpen && (
        <nav className="dock-nav" aria-label="快速導覽">
          <button className={page === "shop" && category !== "小賞" && !memberMenuOpen ? "active" : ""} type="button" onClick={goHome}><i>HOME</i><span>首頁</span></button>
          <button type="button" onClick={() => { setSearchOpen(true); setMemberMenuOpen(false); }}><i>SEARCH</i><span>搜尋</span></button>
          <button className={page === "shop" && category === "小賞" && !memberMenuOpen ? "active" : ""} type="button" onClick={() => { setCategory("小賞"); navigate("shop"); }}><i>LUCKY</i><span>小賞</span></button>
          <button className={page === "favorites" && !memberMenuOpen ? "active" : ""} type="button" onClick={() => navigate("favorites")}><i>LOVE</i><span>收藏</span>{favorites.length > 0 && <b>{favorites.length}</b>}</button>
          <button className={page === "member" || memberMenuOpen ? "active" : ""} type="button" onClick={() => { user ? setMemberMenuOpen(!memberMenuOpen) : setAuthOpen(true); }}><i>MEMBER</i><span>{user ? user.name : "登入"}</span></button>
          <button className={`dock-cart ${page === "checkout" && !memberMenuOpen ? "active" : ""}`} type="button" onClick={() => navigate("checkout")}><i>CART</i><span>購物車</span><b>{cartRows.reduce((sum, row) => sum + row.qty, 0)}</b></button>
        </nav>
      )}

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
                <div className="social-login facebook-only">
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
                <div className="social-login facebook-only">
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
          <button
            className={`product-image ${product.image ? "has-upload" : ""}`}
            style={{ background: product.image ? undefined : product.color }}
            type="button"
            onClick={() => onOpen(product.id)}
          >
            {product.image && <img src={product.image} alt="" />}
            <span>{product.status}</span>
            <b>{product.category}</b>
            <div className="prize-callout">
              <small>庫存速報</small>
              <strong>熱門款・剩 {product.stock}</strong>
            </div>
          </button>
          <div className="product-body">
            <p>{product.category}</p>
            <h3>{product.name}</h3>
            <div className="product-meta">
              <strong>{currency.format(product.price)}</strong>
              <span>已售 {product.sold}</span>
            </div>
            <div className="stock-progress" aria-label={`剩餘庫存 ${product.stock}`}>
              <i style={{ width: `${Math.max(12, Math.min(100, (product.stock / (product.stock + product.sold)) * 100))}%` }} />
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
    return <div className="guide-prose"><p>完成 E-mail 或 Facebook 登入後即可成為會員。會員中心可修改個人資料、查看訂單、申請退貨、管理收藏、查詢折價券與 points。</p></div>;
  }
  if (tab === "售後服務問題") {
    return <div className="guide-prose"><p>收到商品後 7 日內如有瑕疵，請至會員中心訂單查詢申請售後，並提供訂單編號、瑕疵照片與聯絡方式。</p></div>;
  }
  if (tab === "165反詐騙") {
    return <div className="guide-prose"><p>熊賀勝不會電話要求您操作 ATM、解除分期或提供信用卡資料。若接到可疑電話，請撥打 165 查證。</p></div>;
  }
  return <div className="guide-prose"><p>{tab}內容會於正式上線前依商店政策補齊。</p></div>;
}

function MemberPanel({
  tab,
  user,
  favorites,
  orders,
  onCancelOrder,
}: {
  tab: string;
  user: User;
  favorites: string[];
  orders: Order[];
  onCancelOrder: (orderId: string) => void;
}) {
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);

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
          <article className="order-card" key={order.id}>
            <div className="list-row">
              <span>{order.id} · {order.date}</span>
              <strong>{currency.format(order.total)} / {order.status}</strong>
              <div className="row-actions">
                <button
                  type="button"
                  onClick={() => setOpenOrderId(openOrderId === order.id ? null : order.id)}
                >
                  {openOrderId === order.id ? "收合明細" : "查看明細"}
                </button>
                {order.status === "待出貨" || order.status === "待付款" ? (
                  <button type="button" onClick={() => onCancelOrder(order.id)}>
                    申請取消
                  </button>
                ) : null}
              </div>
            </div>
            {openOrderId === order.id && (
              <div className="order-detail">
                <dl>
                  <div><dt>收件人</dt><dd>{order.receiver}</dd></div>
                  <div><dt>手機</dt><dd>{order.phone}</dd></div>
                  <div><dt>配送</dt><dd>{order.shipping}</dd></div>
                  <div><dt>地址/門市</dt><dd>{order.address}</dd></div>
                  <div><dt>付款</dt><dd>{order.payment}</dd></div>
                </dl>
                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={`${order.id}-${item.productName}`}>
                      <span>{item.productName}</span>
                      <strong>{item.qty} x {currency.format(item.price)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
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

function AdminPanel({
  tab,
  products,
  orders,
  members,
  coupons,
  announcements,
  onEditProduct,
  onCycleProductStatus,
  onSaveCoupon,
  onSaveAnnouncement,
  onUpdateMemberLevel,
  onUpdateOrderStatus,
}: {
  tab: string;
  products: Product[];
  orders: Order[];
  members: Member[];
  coupons: Coupon[];
  announcements: Announcement[];
  onEditProduct: (product: Product) => void;
  onCycleProductStatus: (productId: string) => void;
  onSaveCoupon: (draft: CouponDraft, editingId: string | null) => boolean;
  onSaveAnnouncement: (draft: AnnouncementDraft, editingId: string | null) => boolean;
  onUpdateMemberLevel: (memberId: string, level: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}) {
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const [openMemberId, setOpenMemberId] = useState<string | null>(null);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [couponDraft, setCouponDraft] = useState<CouponDraft>(emptyCouponDraft);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<string | null>(null);
  const [announcementDraft, setAnnouncementDraft] = useState<AnnouncementDraft>(emptyAnnouncementDraft);

  if (tab === "商品管理") {
    return (
      <div className="admin-list">
        <h2>商品管理</h2>
        {products.map((product) => (
          <div className="list-row admin-product-row" key={product.id}>
            <span>{product.name}</span>
            <strong>{product.stock} 件 / {product.status}</strong>
            <div className="row-actions">
              <button type="button" onClick={() => onEditProduct(product)}>
                編輯
              </button>
              <button type="button" onClick={() => onCycleProductStatus(product.id)}>
                切換狀態
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tab === "近期訂單") {
    const cancelRequests = orders.filter((order) => order.status === "取消申請中");
    return (
      <div className="admin-list">
        <h2>近期訂單</h2>
        {cancelRequests.length > 0 && (
          <div className="admin-alert">
            <strong>有 {cancelRequests.length} 筆取消訂單申請</strong>
            <span>請查看訂單明細後確認取消，確認前訂單不會變成已取消。</span>
          </div>
        )}
        {orders.map((order) => (
          <article className="order-card" key={order.id}>
            <div className="list-row admin-order-row">
              <span>{order.id} · {order.receiver}</span>
              <strong>{currency.format(order.total)}</strong>
              <div className="row-actions">
                <select
                  className="inline-select order-status-select"
                  value={order.status}
                  onChange={(event) => onUpdateOrderStatus(order.id, event.target.value as OrderStatus)}
                >
                  <option>待付款</option>
                  <option>待出貨</option>
                  <option>已出貨</option>
                  <option>已完成</option>
                  <option>取消申請中</option>
                  <option>已取消</option>
                </select>
                <button type="button" onClick={() => setOpenOrderId(openOrderId === order.id ? null : order.id)}>
                  {openOrderId === order.id ? "收合明細" : "查看明細"}
                </button>
              </div>
            </div>
            {openOrderId === order.id && (
              <div className="order-detail">
                {order.status === "取消申請中" && (
                  <div className="cancel-request-box">
                    <strong>會員已提出取消申請</strong>
                    <span>確認後才會正式取消這筆訂單；若不接受取消，可以將訂單保留為待出貨。</span>
                    <div className="row-actions">
                      <button type="button" onClick={() => onUpdateOrderStatus(order.id, "已取消")}>
                        確認取消
                      </button>
                      <button type="button" onClick={() => onUpdateOrderStatus(order.id, "待出貨")}>
                        保留訂單
                      </button>
                    </div>
                  </div>
                )}
                <dl>
                  <div><dt>訂單日期</dt><dd>{order.date}</dd></div>
                  <div><dt>收件人</dt><dd>{order.receiver}</dd></div>
                  <div><dt>手機</dt><dd>{order.phone}</dd></div>
                  <div><dt>配送</dt><dd>{order.shipping}</dd></div>
                  <div><dt>地址/門市</dt><dd>{order.address}</dd></div>
                  <div><dt>付款方式</dt><dd>{order.payment}</dd></div>
                </dl>
                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={`${order.id}-${item.productName}`}>
                      <span>{item.productName}</span>
                      <strong>{item.qty} x {currency.format(item.price)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    );
  }

  if (tab === "會員管理") {
    return (
      <div className="admin-list">
        <h2>會員管理</h2>
        {members.map((member) => (
          <article className="order-card" key={member.id}>
            <div className="list-row member-admin-row">
              <span>{member.name} · {member.email}</span>
              <select
                className="inline-select"
                value={member.level}
                onChange={(event) => onUpdateMemberLevel(member.id, event.target.value)}
              >
                <option>新會員</option>
                <option>銀熊會員</option>
                <option>金熊會員</option>
                <option>VIP</option>
              </select>
              <button type="button" onClick={() => setOpenMemberId(openMemberId === member.id ? null : member.id)}>
                {openMemberId === member.id ? "收合資料" : "查看詳細"}
              </button>
            </div>
            {openMemberId === member.id && (
              <div className="member-detail">
                <div><span>手機</span><strong>{member.phone}</strong></div>
                <div><span>狀態</span><strong>{member.status}</strong></div>
                <div><span>累計消費</span><strong>{currency.format(member.spent)}</strong></div>
                <div><span>訂單數</span><strong>{member.orders} 筆</strong></div>
                <div className="wide-field"><span>地址</span><strong>{member.address}</strong></div>
                <div><span>加入日期</span><strong>{member.joinedAt}</strong></div>
              </div>
            )}
          </article>
        ))}
      </div>
    );
  }

  if (tab === "折價券") {
    return (
      <div className="admin-list">
        <form
          className="admin-mini-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (onSaveCoupon(couponDraft, editingCouponId)) {
              setCouponDraft(emptyCouponDraft);
              setEditingCouponId(null);
            }
          }}
        >
          <h2>{editingCouponId ? "編輯折價券" : "新增折價券"}</h2>
          <div className="admin-form-grid">
            <label>代碼<input value={couponDraft.code} onChange={(event) => setCouponDraft((draft) => ({ ...draft, code: event.target.value }))} placeholder="BEAR100" /></label>
            <label>名稱<input value={couponDraft.title} onChange={(event) => setCouponDraft((draft) => ({ ...draft, title: event.target.value }))} placeholder="滿 999 折 100" /></label>
            <label>
              類型
              <select value={couponDraft.type} onChange={(event) => setCouponDraft((draft) => ({ ...draft, type: event.target.value as CouponDraft["type"] }))}>
                <option value="fixed">固定金額</option>
                <option value="percent">百分比</option>
              </select>
            </label>
            <label>折抵值<input type="number" min="1" value={couponDraft.value} onChange={(event) => setCouponDraft((draft) => ({ ...draft, value: event.target.value }))} placeholder="100" /></label>
            <label>低消<input type="number" min="0" value={couponDraft.minOrder} onChange={(event) => setCouponDraft((draft) => ({ ...draft, minOrder: event.target.value }))} placeholder="999" /></label>
            <label>到期日<input type="date" value={couponDraft.expiresAt} onChange={(event) => setCouponDraft((draft) => ({ ...draft, expiresAt: event.target.value }))} /></label>
            <label>
              狀態
              <select value={couponDraft.status} onChange={(event) => setCouponDraft((draft) => ({ ...draft, status: event.target.value as CouponStatus }))}>
                <option>啟用中</option>
                <option>停用</option>
              </select>
            </label>
          </div>
          <div className="form-actions">
            <button className="button primary" type="submit">{editingCouponId ? "儲存折價券" : "新增折價券"}</button>
            {editingCouponId && (
              <button className="button ghost" type="button" onClick={() => { setCouponDraft(emptyCouponDraft); setEditingCouponId(null); }}>
                取消編輯
              </button>
            )}
          </div>
        </form>
        {coupons.map((couponItem) => (
          <div className="list-row admin-coupon-row" key={couponItem.id}>
            <span>{couponItem.code} · {couponItem.title}</span>
            <strong>{couponItem.type === "percent" ? `${couponItem.value}%` : currency.format(couponItem.value)} / 滿 {currency.format(couponItem.minOrder)}</strong>
            <div className="row-actions">
              <button type="button">{couponItem.status}</button>
              <button type="button" onClick={() => { setCouponDraft(couponToDraft(couponItem)); setEditingCouponId(couponItem.id); }}>
                編輯
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tab === "公告") {
    return (
      <div className="admin-list">
        <form
          className="admin-mini-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (onSaveAnnouncement(announcementDraft, editingAnnouncementId)) {
              setAnnouncementDraft(emptyAnnouncementDraft);
              setEditingAnnouncementId(null);
            }
          }}
        >
          <h2>{editingAnnouncementId ? "編輯公告" : "新增公告"}</h2>
          <div className="admin-form-grid">
            <label>標題<input value={announcementDraft.title} onChange={(event) => setAnnouncementDraft((draft) => ({ ...draft, title: event.target.value }))} placeholder="跑馬燈公告" /></label>
            <label>
              狀態
              <select value={announcementDraft.status} onChange={(event) => setAnnouncementDraft((draft) => ({ ...draft, status: event.target.value as AnnouncementStatus }))}>
                <option>顯示中</option>
                <option>隱藏</option>
              </select>
            </label>
            <label className="wide-field">
              內容
              <textarea rows={3} value={announcementDraft.content} onChange={(event) => setAnnouncementDraft((draft) => ({ ...draft, content: event.target.value }))} placeholder="滿 999 享 7-11 免運" />
            </label>
          </div>
          <div className="form-actions">
            <button className="button primary" type="submit">{editingAnnouncementId ? "儲存公告" : "新增公告"}</button>
            {editingAnnouncementId && (
              <button className="button ghost" type="button" onClick={() => { setAnnouncementDraft(emptyAnnouncementDraft); setEditingAnnouncementId(null); }}>
                取消編輯
              </button>
            )}
          </div>
        </form>
        {announcements.map((announcement) => (
          <div className="list-row announcement-row" key={announcement.id}>
            <span>{announcement.title} · {announcement.content}</span>
            <strong>{announcement.updatedAt}</strong>
            <div className="row-actions">
              <button type="button">{announcement.status}</button>
              <button
                type="button"
                onClick={() => {
                  setAnnouncementDraft({
                    title: announcement.title,
                    content: announcement.content,
                    status: announcement.status,
                  });
                  setEditingAnnouncementId(announcement.id);
                }}
              >
                編輯
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="admin-list">
      <h2>{tab}</h2>
      <p>目前無可用資料。</p>
    </div>
  );
}
