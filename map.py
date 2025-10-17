from PIL import Image, ImageFilter
import numpy as np

def process_image(
    image_path,
    output_path,
    target_color="#EEF2EC",
    tolerance=30,
    blur_radius=2,
    layer_count=4,
    layer_opacity=0.25,
    layer_offset=5,
):
    """
    Оставляет на картинке только цвета, близкие к target_color, заменяет их на зелёный.
    Прозрачность уменьшается с расстоянием от центра.
    После этого добавляются несколько копий слоя (эффект свечения).
    """

    try:
        img = Image.open(image_path).convert("RGBA")
        img_array = np.array(img)

        # Преобразуем HEX цвет в RGB
        target_color = target_color.lstrip("#")
        target_rgb = tuple(int(target_color[i:i+2], 16) for i in (0, 2, 4))

        # Маска целевого цвета
        red_diff = np.abs(img_array[:, :, 0] - target_rgb[0])
        green_diff = np.abs(img_array[:, :, 1] - target_rgb[1])
        blue_diff = np.abs(img_array[:, :, 2] - target_rgb[2])
        mask = (red_diff <= tolerance) & (green_diff <= tolerance) & (blue_diff <= tolerance)

        h, w = img_array.shape[:2]
        y, x = np.ogrid[:h, :w]
        cx, cy = w / 2, h / 2

        # Расстояние до центра
        dist = np.sqrt((x - cx) ** 2 + (y - cy) ** 2)
        max_dist = np.sqrt(cx**2 + cy**2)
        dist_norm = np.clip(dist / max_dist, 0, 1)

        # Альфа-градиент (в центре непрозрачно, к краям прозрачно)
        alpha_gradient = (1 - dist_norm) ** 2

        # Создаём базовое зелёное изображение
        new_img_array = np.zeros((h, w, 4), dtype=np.uint8)
        new_img_array[mask, 1] = 255
        new_img_array[mask, 3] = (255 * alpha_gradient[mask]).astype(np.uint8)
        new_img = Image.fromarray(new_img_array, "RGBA")

        # Размытие (если нужно)
        if blur_radius > 0:
            new_img = new_img.filter(ImageFilter.GaussianBlur(radius=blur_radius))

        # === ЭФФЕКТ НАЛОЖЕНИЯ НЕСКОЛЬКИХ СЛОЁВ ===
        base = new_img.copy()
        for i in range(1, layer_count + 1):
            # Смещаем каждый слой немного
            offset_x = int((i - layer_count / 2) * layer_offset)
            offset_y = int((layer_count / 2 - i) * layer_offset)

            layer = new_img.copy()
            # Немного уменьшаем прозрачность каждого слоя
            alpha = layer.split()[3].point(lambda a: int(a * layer_opacity))
            layer.putalpha(alpha)

            # Накладываем поверх
            base.alpha_composite(layer, (offset_x, offset_y))

        # Сохраняем
        img.save(image_path)
        base.save(output_path, "PNG")

        print(f"Изображение обработано и сохранено в {output_path}")

    except FileNotFoundError:
        print(f"Ошибка: Файл '{image_path}' не найден.")
    except Exception as e:
        print(f"Произошла ошибка: {e}")


# Пример использования:
image_path = "Снимок экрана 2025-10-07 210036.png"
output_path = "output.png"
target_color = "#EEF2EC"
tolerance = 7
blur_radius = 50
process_image(
    image_path,
    output_path,
    target_color,
    tolerance,
    blur_radius,
    layer_count=4,       # сколько копий поверх
    layer_opacity=1,  # прозрачность каждого дополнительного слоя
    layer_offset=0,     # насколько каждый слой смещается
)
