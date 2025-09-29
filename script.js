const cart_modal = document.getElementById("cart-modal");
const order_modal = document.getElementById("order-modal");
const cart_btn = document.getElementById("cart-btn");
const close_btns = document.querySelectorAll(".close-btn");
const cart_items_list = document.getElementById("cart-items");
const cart_total_sum = document.getElementById("cart-total-sum");
const cart_count = document.getElementById("cart-count");
const checkout_btn = document.getElementById("checkout");
const order_form = document.getElementById("order-form");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const add_to_cart_btns = document.querySelectorAll(".add-to-cart");

function save_cart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    render_cart();
    console.log('Ответ из виджета:');
}

function render_cart() {
    cart_items_list.innerHTML = "";
    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        count += item.quantity;

        const li = document.createElement("li");
        li.innerHTML = `
            <span>${item.name} - ${item.price}₽</span>
            <div class="quantity-control">
                <button class="decrease">-</button>
                <span>${item.quantity}</span>
                <button class="increase">+</button>
            </div>
            <button class="remove">Удалить</button>
        `;

        li.querySelector(".decrease").addEventListener("click", () => {
            if (item.quantity > 1) {
                item.quantity--;
                update_button_state(item.name, true);
            } else {
                cart.splice(index, 1);
                update_button_state(item.name, false);
            }
            save_cart();
        });

        li.querySelector(".increase").addEventListener("click", () => {
            item.quantity++;
            save_cart();
            update_button_state(item.name, true);
        });

        li.querySelector(".remove").addEventListener("click", () => {
            cart.splice(index, 1);
            update_button_state(item.name, false);
            save_cart();
        });

        cart_items_list.appendChild(li);
    });

    cart_total_sum.textContent = total + "₽";
    cart_count.textContent = count;
    localStorage.setItem("cart", JSON.stringify(cart));
}

function update_button_state(name, in_cart) {
    add_to_cart_btns.forEach((btn) => {
        if (btn.dataset.name === name) {
            const product_in_cart = cart.find(item => item.name === name);
            if (in_cart && product_in_cart) {
                btn.textContent = `В корзине (${product_in_cart.quantity} шт.)`;
            } else {
                btn.textContent = "Добавить в корзину";
            }
        }
    });
}

add_to_cart_btns.forEach((btn) => {
    const product_card = btn.closest(".product-card");
    const name = product_card.querySelector("h2").innerText;
    const price = parseInt(product_card.querySelector(".product-price").innerText);

    btn.dataset.name = name;

    btn.addEventListener("click", () => {
        const product_in_cart = cart.find((item) => item.name === name);

        if (product_in_cart) {
            product_in_cart.quantity++;
            update_button_state(name, true);
        } else {
            cart.push({ name, price, quantity: 1 });
            update_button_state(name, true);
        }

        save_cart();
    });
});

cart_btn.addEventListener("click", () => {
    cart_modal.classList.add("active");
    render_cart();
});

close_btns.forEach((btn) => {
    btn.addEventListener("click", () => {
        cart_modal.classList.remove("active");
        order_modal.classList.remove("active");
    });
});

window.addEventListener("click", (e) => {
    if (e.target === cart_modal || e.target === order_modal) {
        cart_modal.classList.remove("active");
        order_modal.classList.remove("active");
    }
});

checkout_btn.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Корзина пуста! Добавьте товары перед оформлением заказа.");
        return;
    }
    cart_modal.classList.remove("active");
    order_modal.classList.add("active");
});

order_form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Заказ создан!");
    cart.forEach(item => update_button_state(item.name, false));
    cart = [];
    save_cart();
    order_modal.classList.remove("active");
});

render_cart();
cart.forEach((item) => update_button_state(item.name, true));
