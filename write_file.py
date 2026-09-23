import sys, base64
with open(sys.argv[1], "w", encoding="utf-8") as f: f.write(base64.b64decode(sys.argv[2]).decode("utf-8"))