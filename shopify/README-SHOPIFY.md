# Перенос на Shopify

Пакет в `shopify/` — drop-in для темы Shopify 2.0 (Dawn, Nook и производные):
секция конструктора, секция маркетинговых блоков, шаблон страницы,
заскоупленный CSS, шрифты, картинки и `products.csv` для импорта товаров.

```bash
node tools/build-shopify.js    # пересобрать shopify/assets и products.csv после правок
```

## Как бокс попадает в корзину

Один бокс = **вариант товара-бокса по размеру** + **по строке на каждый платный доп**.

| Строка корзины | SKU | Цена |
|---|---|---|
| Ruby Gift Box — The Little Box, 4 cups | `YL-BOX-SMALL` | $32.99 |
| Ruby Gift Box — The Signature Box, 8 cups | `YL-BOX-MEDIUM` | $54.99 |
| Ruby Gift Box — The Grand Box, 12 cups | `YL-BOX-LARGE` | $79.99 |
| Your Own Photos on the Lid | `YL-ADD-PHOTOS` | $5.99 |
| Satin Ribbon & Gift Tag | `YL-ADD-RIBBON` | $6.99 |
| Greeting Card with Your Message | `YL-ADD-CARD` | $4.99 |
| Refill Pouch × 4 (отдельные товары) | `YL-POUCH-*` | $14.99–16.99 |

Весь заказ едет **свойствами строки бокса** — их видно в корзине, на чекауте и в заказе:
`Size`, `Occasion`, `Lid headline`, `Photo captions`, `Lid photos`, `Cup 1` … `Cup 12`,
`Card to / from / message`, `Ribbon`. Скрытые `_yl_group` (связывает бокс и его допы)
и `_yl_payload` (весь бокс в JSON — на случай, если понадобится восстановить заказ).

**Фото клиента** уходят **файлами** в свойствах `Photo 1` и `Photo 2`: если в боксе есть
свои фото, строка бокса отправляется в `/cart/add.js` как `multipart/form-data`, и Shopify
сам загружает файлы и прикрепляет ссылки к заказу. Печатник открывает заказ → строка бокса →
ссылки на обе фотографии. Фото ужаты в браузере до 900 px по длинной стороне (JPEG) —
этого хватает на полароид шириной пару дюймов.

Размер находится по SKU варианта (`YL-BOX-SMALL/MEDIUM/LARGE`), допы тоже **по SKU**,
так что названия товаров и вариантов можно менять как угодно.
Если товара-допа нет в коллекции, конструктор всё равно добавит бокс, а в консоли
напишет, какой SKU не нашёлся (доп в этом случае не будет оплачен — проверьте после импорта).

## Установка

1. **Товары.** Products → Import → `shopify/products.csv`. Создадутся бокс с тремя вариантами
   по размеру, 3 допа и 4 пакета-рефилла. Всем стоит `continue` — продаются без учёта остатков.
2. **Коллекция допов.** Collections → создать умную коллекцию **Gift box add-ons**
   (handle `gift-box-add-ons`) с условием *Tag equals `yl-addon`*. В неё попадут
   допы и рефиллы.
3. **Файлы темы.** Online Store → Themes → *Duplicate* живую тему → Edit code:
   - всё из `shopify/assets/` → *Assets* (шрифты, картинки, js, `yummyland-style.css.liquid`);
   - `shopify/sections/*.liquid` → *Sections*;
   - `shopify/templates/page.build-your-box.json` → *Templates*.
4. **Страница.** Pages → Add page «Build your box», шаблон `page.build-your-box`.
5. **Проверить в редакторе темы**, что у секции *Yummyland gift box builder* выбран товар
   *Ruby Gift Box* и коллекция *Gift box add-ons* (в шаблоне они прописаны
   по handle, но глазами подтвердить стоит).
6. Собрать Signature Box со своими фото, лентой и открыткой → в корзине должно быть 4 строки,
   сумма = та, что показывал конструктор ($72.96), в свойствах бокса — размер, восемь ячеек
   и две ссылки на фото.
7. Publish темы. Откат — опубликовать старую тему обратно.

## Если в магазине остались товары старой модели «по весу»

Раньше конструктор продавал боксы по весу: товар `build-your-own-candy-box` с вариантами
`YL-BOX-SMALL/MEDIUM/LARGE/PARTY`, допы `YL-EXTRA-*`, наценки `YL-PREMIUM-*`, коллекция
`box-add-ons`. SKU `YL-BOX-SMALL/MEDIUM/LARGE` теперь используются **новым** товаром
`ruby-gift-box`, поэтому старый товар нужно **удалить до импорта**, иначе в магазине окажутся
два варианта с одним SKU. Промежуточный товар `ruby-signature-gift-box` (`YL-RUBY-SIGNATURE`),
если успели создать, тоже удалить. Всё это draft, покупателю не видно.

## Картинки в теме

В теме все файлы лежат в одной плоской папке, поэтому `assets/img/lid/birthday-1.webp`
превращается в `yummyland-lid-birthday-1.webp`. Секции передают в скрипты адрес этой папки
(`YL.ASSET_BASE`), а `YL.img()` строит имя сам — в коде ничего менять не нужно.
Когда появятся фото для крышек по поводам, положите их в `assets/img/lid/`,
пересоберите пакет и залейте новые `yummyland-lid-*.webp` в Assets.

Фото конфет в теме берутся прямо с Shopify CDN (`YL.PHOTO_BASE = ''`).
