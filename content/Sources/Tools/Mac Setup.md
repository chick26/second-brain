---
title: Mac Setup 
creation date: 2023-03-30 14:45:07
status: done
tag: 
- Sources/Tools
- Logs/SOP
---

## System Preferences

### Dock

*   Remove most applications from Dock
*   Smaller Dock
*   Automatic Hide

### Track pad

*   Tap to Click
*   Point & Click -> Look up & data detectors off

### System Preferences (Terminal)

Override more system preferences from the terminal ...

```shell
# take screenshots as jpg (usually smaller size) and not png
defaults write com.apple.screencapture type jpg

# do not open previous previewed files (e.g. PDFs) when opening a new one
defaults write com.apple.Preview ApplePersistenceIgnoreState YES

# show Library folder
chflags nohidden ~/Library

# show hidden files
defaults write com.apple.finder AppleShowAllFiles YES

# show path bar
defaults write com.apple.finder ShowPathbar -bool true

# show status bar
defaults write com.apple.finder ShowStatusBar -bool true

killall Finder;
```


## Install ClashX

Turn on proxy

```shell
export https_proxy= http://127.0.0.1:7890 http_proxy= http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890
```

## Install App and Cli Tool

### Homebrew

Install [Homebrew](https://brew.sh/) as package manager for macOS:

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Update everything in Homebrew to recent version:

```shell
brew update
```

Install GUI applications (read more about these in GUI Applications), `homebrew-cask — Homebrew Formulae`

```shell
brew install --cask \ 
  1password \
  alfred \  
  battery-buddy \  
  coteditor \  
  docker \  
  eagle \  
  espanso \  
  figma \  
  google-chrome  \  
  gas-mask \  
  handbrake \  
  iina \  
  iterm2 \  
  karabiner-elements \  
  keepingyouawake \  
  keycastr \  
  licecap \  
  microsoft-remote-desktop \  
  obs \  
  obsidian \  
  setapp \  
  shottr \  
  sogouinput \  
  sourcetree \  
  telegram \  
  thor \  
  usr-sse2-rdm \  
  videofusion \  
  visual-studio-code \  
  webstorm \  
  zerotier-one
```

Install terminal applications (read more about these in Terminal Applications), `homebrew-core — Homebrew Formulae`

```shell
brew install \ 
  autojump \  
  bat \  
  cmatrix \  
  commitzen \  
  deno \  
  diff-so-fancy \  
  fd \  
  ffmpeg \  
  fzf \  
  gh \  
  git \  
  httpie \  
  hub \  
  hyperfine \  
  imagemagick \  
  jq \  
  lazygit \  
  mkcert \  
  nvm \  
  pnpm \  
  the_silver_searcher \  
  tig \  
  tldr \  
  tree \  
  ugit \  
  wget
```

###  Mac App Store

* Bob
* Tot
* Enpass

### Other

* Flomo x Pake
* Reeder（国区没有）
* PDF Expert
* uPic

### Built-in MacOS Applications

*   iMessage
    *   sync iCloud for iMessages just for the sake of syncing, then disable iCloud again
    *   sync contacts on iCloud
    *   iPhone: activate message forwarding to new Mac
*   Pages
    *   show word count
*   Apple Mail
    *   set up all email accounts
    *   show most recent message at top
*   Notes
    *   New notes start with: Body
*   Quick Time Player
    *   save to Desktop

## Personal Document Path

- `~/Documents/Code` Save Code
- `~/Documents/SoftwareConfiguration Save configuration

## App Configuration

### Alfred

- 开启 Powerpack
- 同步配置，将老电脑的 Alfred 配置复制到 `~/Documents/SoftwareConfiguration/Alfred` 下，然后在 `Advanced` 里修改配置目录指向他
- `Features > Web Bookmarks`  选择 `Google Chrome Bookmarks`

### iTerm2

*   Make iterm 2 Default Term
*   Preferences ->
    *   General -> Window
        *   unselect "Native full screen windows"
    *   Appearance ->
        *   Windows
            *   select "Hide scrollbars"
        *   Tabs
            *   unselect "Show tab bar in fullscreen"
        *   Dimming
            *   Unselect all dimming
    *   Profiles -> Window
        *   Transparency: 30
        *   Style: Full Screen
        *   Screen: Main Screen
    *   Profiles -> Advanced
        *   Semantic History -> Open with editor ... -> VS Code
    *   [Open new split pane with current directory](https://apple.stackexchange.com/a/337386)
    *   [Natural Text Editing](https://apple.stackexchange.com/a/293988)
*   Bring it to fullscreen Command + Enters

### Oh my Zsh


```shell
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

Update everything (e.g. plugins) in Oh My Zsh to recent version:

```shell
omz update
```

Important: If you change something in your Zsh configuration (_. Zshrc_), force a reload:

**Oh My Zsh Theme + Fonts:**

Install [Starship](https://starship.rs/) as your new terminal theme. We will use Homebrew, but you can use an alternative from the website too:

```shell
brew install starship
```

Make it the default theme for Oh My ZSH from the terminal:

```shell
echo 'eval "$(starship init zsh)"' >> ~/.zshrc
```

As font we will be using Hack Nerd Font in iTerm 2, VS Code, and Sublime Text. Install it via:

```shell
brew tap homebrew/cask-fonts
brew install --cask font-hack-nerd-font
```

Use the new font in iTerm 2: Preferences -> Profile -> Text -> Font: font-hack-nerd-font.

If the theme and font changes do not apply, reload your zsh configuration (_. Zshrc_) or close/open iTerm 2.

#### Oh My Zsh Plugins

*   [zsh-completions](https://github.com/zsh-users/zsh-completions)
*   [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions)
*   [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting)

#### ZSH Configuration File (_. Zshrc_):

```shell
# Disable brew auto update
export HOMEBREW_NO_AUTO_UPDATE=1
export ZSH="$HOME/.oh-my-zsh"

plugins=(
  # 不会 git 插件，因为和我的 alias 设置冲突
  # git
  zsh-completions
  zsh-autosuggestions
  fast-syntax-highlighting
)

# Alias
alias ,ms="%PATH/TO/MY/SCRIPT%"
alias ,ip="ipconfig getifaddr en0"
alias ,sshconfig="vim ~/.ssh/config"
alias ,gitconfig="vim ~/.gitconfig"
alias b=",ms branch"
alias umi="/Users/%MY_USERNAME%/Documents/Code/github.com/umijs/umi/packages/umi/bin/umi.js"
# chore
alias br="bun run"
alias c='code .'
alias i='webstorm .'
alias cdtmp='cd `mktemp -d /tmp/sorrycc-XXXXXX`'
alias pi="echo 'Pinging Baidu' && ping www.baidu.com"
alias ip="ipconfig getifaddr en0 && ipconfig getifaddr en1"
alias cip="curl cip.cc"
alias qr='qrcode-terminal'
alias ee="stree"
alias hosts="vi /etc/hosts"
## system
alias showFiles="defaults write com.apple.finder AppleShowAllFiles YES && killall Finder"
alias hideFiles="defaults write com.apple.finder AppleShowAllFiles NO && killall Finder"
# cd
alias ..='cd ../'
alias ...='cd ../../'
alias ..l.='cd ../../ && ll'
alias ....='cd ../../../'
alias ~="cd ~"
alias -- -="cd -"
alias ll='ls -alhG'
alias ls='ls -G'
# git
alias git=hub
alias gp="git push"
alias gt="git status -sb"
alias ga="git add ."
alias gc="git commit -av"
alias gcr="git checkout master && git fetch && git rebase"
alias gclean="git reset --hard && git clean -df"
alias grebase="git fetch && git rebase -i"
## timelapse
## ref: https://www.reddit.com/r/mac/comments/wshn4/another_way_to_timelapse_record_your_mac_screen/
function record() {
  cd ~/screencapture/jpg;
  RES_WIDTH=$(/usr/sbin/system_profiler SPDisplaysDataType | grep Resolution);
  RES_WIDTH=(${RES_WIDTH:22:4});
  RES_WIDTH=$((RES_WIDTH/2));
  while :
  NOW=$(date +"%y%m%d%H%M%S");
  do screencapture -C -t jpg -x ~/screencapture/jpg/$NOW.jpg;
    sleep 7 & pid=$!
    NOW=$(date +"%y%m%d%H%M%S");
    wait $pid
  done
}
function movie() {
  NOW=$(date +"%y%m%d%H%M%S");
  cd ~/screencapture/jpg;
  cnt=0
  rm -rf .DS_Store;
  for file in *
    do
      if [ -f "$file" ] ; then
      ext=${file##*.}
      printf -v pad "%05d" "$cnt"
      mv "$file" "${pad}.${ext}"
      cnt=$(( $cnt + 1 ))
    fi
  done;
  rm -rf 00000.jpg;
  for pic in *.jpg;
    do convert $pic -resize 50% $pic;
  done;
  ffmpeg -r 24 -i %05d.jpg -b 20000k ~/screencapture/mov/$USER-$NOW.mov;
  rm -rf ./*.jpg;
}

function pfd() {
  osascript 2> /dev/null <<EOF
  tell application "Finder"
    return POSIX path of (target of window 1 as alias)
  end tell
EOF
}
function mcd {
  mkdir $1 && cd $1;
}
function cdf() {
  cd "$(pfd)"
}
function ,touch {
  mkdir -p "$(dirname "$1")" && touch "$1"
}
function ,take() {
  mkdir -p "$(dirname "$1")" && touch "$1" && take "$(dirname "$1")"
}

# load zsh-completions
autoload -U compinit && compinit

# use nvm
source /opt/homebrew/opt/nvm/nvm.sh

# autojump
source /opt/homebrew/etc/profile.d/autojump.sh

# use starship theme (needs to be at the end)
eval "$(starship init zsh)"

# 必须在 plugins 之后
source $ZSH/oh-my-zsh.sh

# bun completions
[ -s "/Users/chencheng/.bun/_bun" ] && source "/Users/chencheng/.bun/_bun"

# bun
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# pnpm
export PNPM_HOME="/Users/chencheng/Library/pnpm"
export PATH="$PNPM_HOME:$PATH"
```

### SSH

```shell
mkdir ~/.ssh
# file name 用 github，passphrase 随意
ssh-keygen -t ed25519 -C "github"
# 编辑配置，内容如下
touch ~/.ssh/config

Host *
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/github
# 添加到系统 keychain
ssh-add --apple-use-keychain ~/.ssh/github
```

- Add the public key to your GitHub settings via the website or via the GitHub CLI (via `brew install gh`):

```shell
cat ~/.ssh/id_rsa.pub | pbcopy
 # or use GitHub's CLI
 
# 添加 public key 到 github
gh auth login
gh ssh-key add ~/.ssh/github.pub -t github
```

### Espanso

-  `~/Documents/SoftwareConfiguration/Espanso` 下新建 `base. yml`，内容如下并软链到 Espanso 原来的配置文件夹里。

```yml
matches:
  # misc
  - trigger: ";>>"
    replace: ➡
  - trigger: ";vv"
    replace: ⬇
  - trigger: ";^^"
    replace: ⬆
  - trigger: ";<<"
    replace: ⬅
  # life
  - trigger: ";mobi"
    replace: 我的手机号
  - trigger: ";mail"
    replace: 我的邮箱
  - trigger: ";addr"
    replace: 我的家庭住址
  - trigger: ";officeAddr"
    replace: 公司地址
  # faq
  - trigger: ";chongt"
    replace: 冲突了，merge 下 master。
  # code
  - trigger: ";log"
    replace: console.log($|$)
  - trigger: ";delay"
    replace: const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  # mac symbols
  - trigger: ":cmd"
    replace: "⌘"
  - trigger: ":shift"
    replace: "⇧"
  - trigger: ":ctrl"
    replace: "⌃"
  - trigger: ":alt"
    replace: "⌥"
  - trigger: ":opt"
    replace: "⌥"
  - trigger: ":left"
    replace: "←"
  - trigger: ":right"
    replace: "→"
  - trigger: ":up"
    replace: "↑"
  - trigger: ":down"
    replace: "↓"
  - trigger: ":caps_lock"
    replace: "⇪"
  - trigger: ":esc"
    replace: "⎋"
  - trigger: ":eject"
    replace: "⏏"
  - trigger: ":return"
    replace: "↵"
  - trigger: ":enter"
    replace: "⌅"
  - trigger: ":tab"
    replace: "⇥"
  - trigger: ":backtab"
    replace: "⇤"
  - trigger: ":pgup"
    replace: "⇞"
  - trigger: ":pgdown"
    replace: "⇟"
  - trigger: ":home"
    replace: "↖"
  - trigger: ":end"
    replace: "↘"
  - trigger: ":space"
    replace: "␣"
  - trigger: ":del"
    replace: "⌫"
  - trigger: ":fdel"
    replace: "⌦"
```

### VSCode

使用账号同步配置

### Git

- From terminal, set global name and email:

```shell
git config --global user.name "Your Name"
git config --global user.email "you@your-domain.com"
```

- Set the default branch to main instead of master:

```shell
git config --global init.defaultBranch main
```

- Print global git configuration:

```shell
git config --list
# or alias
# gitconfig
```

- Update git configuration

```shell
git config --global --add push.default current
git config --global --add push.autoSetupRemote true
```

- Edit `~/.gitignore_global`

```
*~
.DS_Store
.idea
```

### NVM 和 Node

```shell
nvm install 18
node -v
```

### Others

- Bob
- Reeder
- Chrome
- Telegram
- Obsidian