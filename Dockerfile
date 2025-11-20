FROM archlinux:latest

RUN cd / && pacman -Syu --noconfirm \   
    && pacman -S --noconfirm \
     python \
     git \
     jdk21-openjdk \
     libxext \
     libxi \
     libxtst \
     libxrender \
     pango \
     fontconfig \
     ttf-dejavu \
     gnupg \
     socat \
     freetype2 \
     ttf-dejavu \
     libx11 \
     libxft \
     xorg \
     xorgproto \
     xorg-server-xvfb
     && pacman -Scc --noconfirm

RUN fc-cache -f -v

RUN cd / && git clone https://github.com/hexaredecimal/TreeLibreWeb.git \
  && cd TreeLibreWeb

WORKDIR /TreeLibreWeb

RUN chmod +x run.sh

RUN mkdir -p /data/tmp

EXPOSE 8080

CMD ["./run.sh"]

