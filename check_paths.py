import os

root = r"e:\Web 3.0\google ai agent"
f_dir = os.path.join(root, "frontend")

print("Root node_modules exists:", os.path.exists(os.path.join(root, "node_modules")))
print("Root autoprefixer exists:", os.path.exists(os.path.join(root, "node_modules", "autoprefixer")))

print("Frontend node_modules exists:", os.path.exists(os.path.join(f_dir, "node_modules")))
print("Frontend autoprefixer exists:", os.path.exists(os.path.join(f_dir, "node_modules", "autoprefixer")))
