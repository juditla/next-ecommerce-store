import Link from 'next/link';
import { getProducts } from '../../database/products';
import { cartSumTotal } from '../../util/cartSum';
import { getCookie } from '../../util/cookies';
import { parseJson } from '../../util/json';
import { mergeCookiesWithProducts } from '../../util/mergeCookiesWithProducts';
import AddOneProduct from './AddOneProduct';
import styles from './page.module.scss';
import RemoveOneProduct from './RemoveOneProduct';
import SetQuantityToZeroButton from './SetQuantityToZeroButton';

export const metadata = {
  title: 'Shopping cart',
  description: 'Your shopping cart at Covfefe',
};

type MergedProduct = {
  id: number;
  name: string;
  type: string;
  origin: string;
  flavourProfile: string[];
  price: number;
  description: string | null;
  quantity: number;
};

function renderTotalAmount(total: number) {
  if (total > 0) {
    return (
      <>
        <div className={styles.renderTotal}>
          <p className={styles.total}>
            Total:
            <span className={styles.product} data-test-id="cart-total">
              {total}
            </span>
            <span className={styles.product}>€</span>
          </p>
        </div>
        <div className={styles.checkoutLinkWrapper}>
          <Link
            data-test-id="cart-checkout"
            className={styles.checkoutLink}
            href="/checkout"
          >
            Proceed to Checkout
          </Link>
        </div>
      </>
    );
  } else {
    return (
      <p className={styles.emptyCart}>
        Your shopping cart is currently empty. Total:{' '}
        <span className={styles.product} data-test-id="cart-total">
          0
        </span>
      </p>
    );
  }
}

export default async function Cart() {
  let total = 0;
  const cartCookies = await getCookie('cart');

  const cart = !cartCookies ? [] : parseJson(cartCookies);
  const products = await getProducts();

  const mergedProducts = mergeCookiesWithProducts(products, cart);

  return (
    <div className={styles.cartPage}>
      <section className={styles.cartSection}>
        <h1 className={styles.header}>Shopping cart:</h1>
        <ul>
          {mergedProducts.map((product: null | MergedProduct) => {
            if (!product) {
              return null;
            }
            if (product.quantity) {
              total = cartSumTotal(total, product.quantity, product.price);
              return (
                <li
                  key={`product-${product.id}`}
                  data-test-id={`cart-product-${product.id}`}
                >
                  <div className={styles.partOne}>
                    <span className={styles.product}>{product.name}:</span>
                    <img
                      src={`/images/productImages/${product.name}.avif`}
                      alt=""
                      width={80}
                      height={80}
                    />
                  </div>

                  <div className="partTwo">
                    Quantity: <AddOneProduct productId={product.id} />
                    <span
                      className={styles.product}
                      data-test-id={`cart-product-quantity-${product.id}`}
                    >
                      {product.quantity}
                    </span>
                    <RemoveOneProduct productId={product.id} />
                  </div>
                  <div className="partThree">
                    Subtotal:{' '}
                    <span className={styles.product}>
                      {product.quantity * product.price}€
                    </span>
                  </div>
                  <div className={styles.partFour}>
                    <SetQuantityToZeroButton productId={product.id} />
                  </div>
                </li>
              );
            } else {
              return undefined;
            }
          })}
        </ul>
        {renderTotalAmount(total)}
      </section>
    </div>
  );
}
