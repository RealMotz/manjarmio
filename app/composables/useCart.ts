export type CartProduct = {
  id: string;
  slug: string;
  name: string;
  price_cents: number | string;
  image_url?: string | null;
};

export type CartItem = Omit<CartProduct, "price_cents"> & {
  price_cents: number;
  quantity: number;
};

const storageKey = "manjarmio-cart";
let persistenceStarted = false;

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;

  const item = value as Partial<CartItem>;
  return (
    typeof item.id === "string" &&
    typeof item.slug === "string" &&
    typeof item.name === "string" &&
    typeof item.price_cents === "number" &&
    typeof item.quantity === "number"
  );
}

function readStoredCart(): CartItem[] {
  try {
    const value = localStorage.getItem(storageKey);
    if (!value) return [];

    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(isCartItem)
      .filter((item) => item.quantity > 0 && Number.isFinite(item.price_cents))
      .map((item) => ({ ...item, quantity: Math.floor(item.quantity) }));
  } catch {
    return [];
  }
}

export function useCart() {
  const items = useState<CartItem[]>("cart-items", () => []);
  const hasHydrated = useState("cart-hydrated", () => false);

  if (import.meta.client && !persistenceStarted) {
    persistenceStarted = true;

    onMounted(() => {
      items.value = readStoredCart();
      hasHydrated.value = true;
    });

    watch(
      items,
      (value) => localStorage.setItem(storageKey, JSON.stringify(value)),
      { deep: true },
    );
  }

  const itemCount = computed(() =>
    items.value.reduce((total, item) => total + item.quantity, 0),
  );
  const subtotalCents = computed(() =>
    items.value.reduce(
      (total, item) => total + item.price_cents * item.quantity,
      0,
    ),
  );

  const addProduct = (product: CartProduct) => {
    const priceCents = Number(product.price_cents);
    if (!Number.isFinite(priceCents) || priceCents < 0) return;

    const existingItem = items.value.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
      return;
    }

    items.value.push({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price_cents: Math.round(priceCents),
      image_url: product.image_url ?? null,
      quantity: 1,
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const item = items.value.find((cartItem) => cartItem.id === productId);
    if (!item) return;

    if (quantity <= 0) {
      items.value = items.value.filter((cartItem) => cartItem.id !== productId);
      return;
    }

    item.quantity = Math.min(99, Math.floor(quantity));
  };

  const removeItem = (productId: string) => {
    items.value = items.value.filter((item) => item.id !== productId);
  };

  const clearCart = () => {
    items.value = [];
  };

  return {
    items,
    hasHydrated,
    itemCount,
    subtotalCents,
    addProduct,
    updateQuantity,
    removeItem,
    clearCart,
  };
}
