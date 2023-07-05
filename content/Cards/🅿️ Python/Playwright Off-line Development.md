---
title: Playwright Off-line Development
creation date: 2023-01-31 11:11 
status: ondo
tags: 
- Development/Frontend/Python
- Development/Frontend/Python/Playwright
---
up:: [[• TOC for Python](%E2%80%A2%20TOC%20for%20Python.md)

## Off-line System Python Develop Environment Configuration

### Anaconda Off-line Package Installation

1.  Download the **wheel** package.
2.  Download binary files or `.whl` files from an authentic website.
3.  Open Anaconda Command prompt as administrator.
4.  Use cd `C:\Users\…` to locate the downloaded site.
5.  Then run pip install `. whl`

### Playwright Develop Environment Configuration

1. Install browser driver at local environment.

```shell
python -m playwright install
```

2. Copy the brower driver from local environment to off-line environment on the same path.  The driver is located at `C:\User\User Name\appdata\local\ms-playwright` .

### VScode Off-line package Installation

1. [Visualstudio Marketplace]( https://marketplace.visualstudio.com/vscode )
2. Download the installation package ``. vsix`
3. Under `/bin` in the **VSCode** installation directory, do the following

```shell
code --install-extension yzhang.markdown-all-in-one-1.4.0.vsix
```

4. Install [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python)、[Code Runner](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner)

## Playwright

### Playwright Development

[Fast and reliable end-to-end testing for modern web apps | Playwright Python](https://playwright.dev/python/)

### Playwright Packaging Using Pyinstaller

[PyInstaller Manual — PyInstaller 5.7.0 documentation](https://pyinstaller.org/en/stable/index.html)

1. Packaging instruction

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH="0"  
playwright install chromium  
pyinstaller -F main.py
```

2. `pandas` with `openpyxl` engine packaging
	1. Use the command above to package, there will be a **Module Missing Error** causing by `openpyxl` .
	2. Try `hidden-import` command to package `openpyxl` in and it failed
	3. The solution is

```shell
pyinstaller -F main.py --hidden-import="openpyxl.cell._writer"
```