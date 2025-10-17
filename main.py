from PIL import Image, ImageDraw, ImageFilter

# Задаем координаты многоугольника
park_coordinates = [
    (56.841922, 60.6819747),
    (56.8408388, 60.6818846),
    (56.8408324, 60.6821436),
    (56.8404424, 60.6829854),
    (56.8399031, 60.683507),
    (56.8400599, 60.6840808),
    (56.840719, 60.6831654),
    (56.8410044, 60.6831721),
    (56.8410317, 60.6837088),
    (56.8412532, 60.6837274),
    (56.841256, 60.6836142),
    (56.8413738, 60.683624),
    (56.8413781, 60.6834518),
    (56.8414517, 60.6832253),
    (56.8414575, 60.6829599),
    (56.8417238, 60.6829795),
    (56.8417604, 60.6832056),
    (56.8419, 60.6832105),
    (56.8419008, 60.6828289),
    (56.841922, 60.6819747)
]

mera = 360

# Находим минимальные значения по x и y
min_x = min(coord[0] for coord in park_coordinates)
min_y = min(coord[1] for coord in park_coordinates)

# Вычитаем минимальные значения из всех координат
normalized_coordinates = [(x - min_x, y - min_y) for x, y in park_coordinates]

# Находим максимальные значения после нормализации
max_x = max(coord[0] for coord in normalized_coordinates)
max_y = max(coord[1] for coord in normalized_coordinates)

# Определяем коэффициент масштабирования
scale_factor = mera / max(max_x, max_y)

# Применяем коэффициент масштабирования
scaled_coordinates = [(int(x * scale_factor), int(y * scale_factor)) for x, y in normalized_coordinates]

# Создаем изображение с прозрачным фоном
width = mera
height = mera
image = Image.new("RGBA", (width, height), (0, 0, 0, 0))

# Рисуем многоугольник
draw = ImageDraw.Draw(image)
draw.polygon(scaled_coordinates, fill=(0, 255, 0, 255))  # Зеленый цвет

# Применяем размытие
blurred_image = image.filter(ImageFilter.GaussianBlur(radius=80))  # Увеличьте radius для более сильного размытия

# Сохраняем изображение
blurred_image.save("park_polygon_blurred.png")
