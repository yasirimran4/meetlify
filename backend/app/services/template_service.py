from pathlib import Path
from jinja2 import Environment
from jinja2 import FileSystemLoader

BASE_DIR = Path(__file__).resolve().parent.parent


print(BASE_DIR)

template_env = Environment(
    loader=FileSystemLoader(BASE_DIR / "templates")
)

def render_template(template_name :str,context:dict):
    template = template_env.get_template(template_name)
    return template.render(**context)
    