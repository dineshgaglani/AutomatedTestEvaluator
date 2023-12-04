import time

dynamic_fn_body = """time.sleep(5); print(abc); time.sleep(5); print(abc);"""
dynamic_fn_name = "def dynamic_fn(abc):\n    "
dynamic_fn_body_multiline = dynamic_fn_body.replace(";", "\n   ")
dynamic_fn = f'{dynamic_fn_name}{dynamic_fn_body_multiline}'

print(dynamic_fn)
exec(dynamic_fn)
dynamic_fn("Dynamic function executed!")