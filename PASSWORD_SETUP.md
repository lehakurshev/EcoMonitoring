# Инструкция по настройке пароля администратора

## Как изменить пароль:

### Способ 1: Использование консоли браузера (для разработки)

1. Откройте консоль разработчика (F12)
2. Вставьте следующий код, заменив `ВАШ_НОВЫЙ_ПАРОЛЬ` на нужный пароль:

```javascript
async function generatePasswordHash(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'EcoMonitoring_Salt_2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Генерация хеша для вашего пароля
generatePasswordHash('ВАШ_НОВЫЙ_ПАРОЛЬ').then(hash => {
    console.log('Ваш хеш пароля:', hash);
});
```

3. Скопируйте полученный хеш
4. Откройте файл `src/context/AuthContext.tsx`
5. Замените значение константы `ADMIN_PASSWORD_HASH` на новый хеш

### Способ 2: Использование Node.js

1. Создайте файл `generate-hash.js`:

```javascript
const crypto = require('crypto');

function generatePasswordHash(password) {
    const data = password + 'EcoMonitoring_Salt_2026';
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
}

// Замените 'ВАШ_НОВЫЙ_ПАРОЛЬ' на нужный пароль
const password = 'ВАШ_НОВЫЙ_ПАРОЛЬ';
const hash = generatePasswordHash(password);
console.log('Хеш пароля:', hash);
```

2. Запустите: `node generate-hash.js`
3. Скопируйте полученный хеш
4. Замените значение `ADMIN_PASSWORD_HASH` в `src/context/AuthContext.tsx`
