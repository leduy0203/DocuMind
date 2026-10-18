import sys
import subprocess
from pathlib import Path

# Path to python in venv if available, else system python
VENV_PYTHON = Path(__file__).parent / ".venv" / "Scripts" / "python.exe"
PYTHON_CMD = str(VENV_PYTHON) if VENV_PYTHON.exists() else sys.executable


def run_cmd(cmd_list):
    """Run a command list and print output."""
    try:
        res = subprocess.run(cmd_list, cwd=Path(__file__).parent)
        return res.returncode
    except Exception as e:
        print(f"[ERROR] Failed to run command: {e}")
        return 1


def print_help():
    print("""
DocuMind Database Migration Helper
===================================
Cac lenh su dung:

1. Sinh migration moi:
   python db.py makemigrations "ten_thay_doi"
   (hoac: python db.py make "ten_thay_doi")

2. Ap dung migration vao database Supabase:
   python db.py migrate
   (hoac: python db.py up)

3. Xem trang thai migration hien tai:
   python db.py status
   (hoac: python db.py current)

4. Quay lui 1 buoc (rollback):
   python db.py rollback
   (hoac: python db.py down)
""")


def main():
    if len(sys.argv) < 2:
        print_help()
        sys.exit(0)

    action = sys.argv[1].lower()

    if action in ["makemigrations", "make", "revision", "new"]:
        msg = sys.argv[2] if len(sys.argv) > 2 else "auto_migration"
        print(f"[*] Dang kiem tra va sinh migration moi voi ghi chu: '{msg}'...")
        code = run_cmd([PYTHON_CMD, "-m", "alembic", "revision", "--autogenerate", "-m", msg])
        if code == 0:
            print("[SUCCESS] Da tao file migration thanh cong! Hay chay 'python db.py migrate' de ap dung.")
        sys.exit(code)

    elif action in ["migrate", "up", "upgrade"]:
        print("[*] Dang ap dung migration vao Supabase Database (upgrade head)...")
        code = run_cmd([PYTHON_CMD, "-m", "alembic", "upgrade", "head"])
        if code == 0:
            print("[SUCCESS] Database Supabase da duoc dong bo thanh cong!")
        sys.exit(code)

    elif action in ["status", "current", "info"]:
        print("[*] Kiem tra phien ban migration hien tai tren Database:")
        code = run_cmd([PYTHON_CMD, "-m", "alembic", "current"])
        sys.exit(code)

    elif action in ["rollback", "down", "downgrade"]:
        print("[*] Dang quay lui 1 phien ban migration (downgrade -1)...")
        code = run_cmd([PYTHON_CMD, "-m", "alembic", "downgrade", "-1"])
        if code == 0:
            print("[SUCCESS] Da rollback thanh cong 1 buoc!")
        sys.exit(code)

    else:
        print(f"[!] Lenh '{action}' khong hop le.")
        print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
