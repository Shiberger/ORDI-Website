/**
 * Where a purchase actually happens.
 *
 * Card payment is built end-to-end — Stripe Checkout, the orders tables, the
 * webhook — but switched off: while the storefront is a portfolio the studio
 * takes every order through its Shopee shop. So the cart, the drawer and
 * /checkout are withdrawn, and every buy button hands off to Shopee instead.
 *
 * Flipping `CHECKOUT_ENABLED` back to true restores all of it with no other
 * edit; nothing here deletes the payment path, it only hides the doors to it.
 */
export const CHECKOUT_ENABLED: boolean = false

/**
 * ORDI's official Shopee storefront — the only place to buy right now.
 *
 * The shop front rather than a per-product deep link: Shopee item ids are not
 * stored against our products, and sending a shopper to a listing that has
 * been relisted under a new id is worse than sending them to the shelf.
 */
export const SHOPEE_STORE_URL = 'https://shopee.co.th/ordi.bkk#product_list'
