<template>
  <div class="gradient-bg" aria-hidden="true">
    <!-- Base dark background -->
    <div class="gradient-base" />

    <!-- Glowing blobs — retro green/cyan/magenta -->
    <div class="blob blob-top-left" />
    <div class="blob blob-top-right" />
    <div class="blob blob-bottom-left" />
    <div class="blob blob-bottom-right" />
    <div class="blob blob-center" />

    <!-- Retro terminal grid -->
    <div class="retro-grid" />

    <!-- Subtle glitch layers -->
    <div class="glitch-layer glitch-layer-1" />
    <div class="glitch-layer glitch-layer-2" />
    <div class="glitch-layer glitch-layer-3" />

    <!-- Animated noise texture -->
    <div class="noise" />

    <!-- Horizontal glitch bands -->
    <div class="glitch-bands" />

    <!-- Scanlines -->
    <div class="scanlines" />

    <!-- Vignette -->
    <div class="vignette" />
  </div>
</template>

<style scoped>
.gradient-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--fx-surface-0);
}

/* Base dark CRT gradient */
.gradient-base {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 50%, var(--fx-surface-2) 0%, var(--fx-surface-1) 60%, var(--fx-surface-0) 100%);
}

/* Animated blobs — retro colors */
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.45;
  animation: float 18s ease-in-out infinite;
}

.blob-top-left {
  top: -10%;
  left: -10%;
  width: 55vw;
  height: 55vw;
  max-width: 700px;
  max-height: 700px;
  background: radial-gradient(circle, color-mix(in srgb, var(--fx-glow) 50%, transparent) 0%, color-mix(in srgb, var(--fx-glow) 30%, transparent) 40%, transparent 70%);
  animation-delay: 0s;
  animation-duration: 22s;
}

.blob-top-right {
  top: -15%;
  right: -10%;
  width: 50vw;
  height: 50vw;
  max-width: 650px;
  max-height: 650px;
  background: radial-gradient(circle, color-mix(in srgb, var(--fx-cyan) 40%, transparent) 0%, color-mix(in srgb, var(--fx-cyan) 30%, transparent) 40%, transparent 70%);
  animation-delay: -5s;
  animation-duration: 20s;
}

.blob-bottom-left {
  bottom: -15%;
  left: -5%;
  width: 45vw;
  height: 45vw;
  max-width: 600px;
  max-height: 600px;
  background: radial-gradient(circle, color-mix(in srgb, var(--fx-magenta) 30%, transparent) 0%, color-mix(in srgb, var(--fx-magenta) 20%, transparent) 40%, transparent 70%);
  animation-delay: -10s;
  animation-duration: 25s;
}

.blob-bottom-right {
  bottom: -10%;
  right: -8%;
  width: 50vw;
  height: 50vw;
  max-width: 650px;
  max-height: 650px;
  background: radial-gradient(circle, color-mix(in srgb, var(--fx-glow) 35%, transparent) 0%, color-mix(in srgb, var(--fx-glow) 20%, transparent) 40%, transparent 70%);
  animation-delay: -7s;
  animation-duration: 19s;
}

.blob-center {
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  width: 40vw;
  height: 40vw;
  max-width: 500px;
  max-height: 500px;
  background: radial-gradient(circle, color-mix(in srgb, var(--fx-glow-soft) 20%, transparent) 0%, color-mix(in srgb, var(--fx-glow-soft) 10%, transparent) 50%, transparent 70%);
  animation-delay: -3s;
  animation-duration: 28s;
  opacity: 0.3;
}

/* Retro terminal grid pattern */
.retro-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(color-mix(in srgb, var(--fx-glow) 3%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--fx-glow) 3%, transparent) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 75%);
}

/* ========== GLITCH LAYERS ========== */

/* Subtle color-shifted glitch blocks that appear intermittently */
.glitch-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  mix-blend-mode: screen;
}

.glitch-layer-1 {
  background: linear-gradient(
    0deg,
    transparent 0%,
    transparent 42%,
    color-mix(in srgb, var(--fx-glow) 2%, transparent) 42.5%,
    color-mix(in srgb, var(--fx-glow) 4%, transparent) 43%,
    transparent 44%,
    transparent 67%,
    color-mix(in srgb, var(--fx-cyan) 2.5%, transparent) 67.5%,
    transparent 69%,
    transparent 100%
  );
  animation: glitch-flash-1 8s ease-in-out infinite;
}

.glitch-layer-2 {
  background: linear-gradient(
    0deg,
    transparent 0%,
    transparent 25%,
    color-mix(in srgb, var(--fx-magenta) 2%, transparent) 25.5%,
    transparent 27%,
    transparent 78%,
    color-mix(in srgb, var(--fx-glow) 3%, transparent) 78.5%,
    color-mix(in srgb, var(--fx-glow) 1.5%, transparent) 80%,
    transparent 81%,
    transparent 100%
  );
  animation: glitch-flash-2 12s ease-in-out infinite;
}

.glitch-layer-3 {
  background: linear-gradient(
    0deg,
    transparent 0%,
    transparent 55%,
    color-mix(in srgb, var(--fx-cyan) 3%, transparent) 55.5%,
    transparent 56.5%,
    transparent 88%,
    color-mix(in srgb, var(--fx-glow) 2%, transparent) 88.5%,
    transparent 90%,
    transparent 100%
  );
  animation: glitch-flash-3 15s ease-in-out infinite;
}

/* Animated noise grain */
.noise {
  position: absolute;
  inset: -50%;
  width: 200%;
  height: 200%;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 256px 256px;
  opacity: 0.025;
  animation: noise-drift 0.5s steps(4) infinite;
}

/* Horizontal glitch bands — thin colored lines that drift */
.glitch-bands {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(
      0deg,
      transparent 0%,
      transparent 15.2%,
      color-mix(in srgb, var(--fx-glow) 1.2%, transparent) 15.3%,
      transparent 15.5%,
      transparent 33.7%,
      color-mix(in srgb, var(--fx-cyan) 1.5%, transparent) 33.8%,
      transparent 34.1%,
      transparent 52.4%,
      color-mix(in srgb, var(--fx-magenta) 1%, transparent) 52.5%,
      transparent 52.8%,
      transparent 71.1%,
      color-mix(in srgb, var(--fx-glow) 1.2%, transparent) 71.2%,
      transparent 71.5%,
      transparent 89.6%,
      color-mix(in srgb, var(--fx-cyan) 1%, transparent) 89.7%,
      transparent 90%,
      transparent 100%
    );
  animation: bands-drift 20s linear infinite;
}

/* CRT scanlines */
.scanlines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    var(--fx-scanline) 2px,
    var(--fx-scanline) 4px
  );
  opacity: 0.6;
}

/* Soft vignette on edges */
.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 40%, var(--fx-vignette) 100%);
}

/* ========== ANIMATIONS ========== */

/* Floating blobs */
@keyframes float {
  0%   { transform: translate(0px, 0px) scale(1); }
  25%  { transform: translate(20px, -30px) scale(1.05); }
  50%  { transform: translate(-15px, 20px) scale(0.97); }
  75%  { transform: translate(25px, 15px) scale(1.03); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.blob-top-left    { animation-name: float; }
.blob-top-right   { animation-name: float-reverse; }
.blob-bottom-left { animation-name: float-slow; }
.blob-bottom-right { animation-name: float; }
.blob-center       { animation-name: float-reverse; }

@keyframes float-reverse {
  0%   { transform: translateX(-50%) translate(0px, 0px) scale(1); }
  25%  { transform: translateX(-50%) translate(-20px, 25px) scale(1.04); }
  50%  { transform: translateX(-50%) translate(18px, -20px) scale(0.98); }
  75%  { transform: translateX(-50%) translate(-22px, -12px) scale(1.02); }
  100% { transform: translateX(-50%) translate(0px, 0px) scale(1); }
}

@keyframes float-slow {
  0%   { transform: translate(0px, 0px) scale(1); }
  33%  { transform: translate(30px, -20px) scale(1.06); }
  66%  { transform: translate(-20px, 30px) scale(0.96); }
  100% { transform: translate(0px, 0px) scale(1); }
}

/* Glitch flashes — brief opacity spikes staggered across layers */
@keyframes glitch-flash-1 {
  0%, 100%  { opacity: 0; transform: translateX(0); }
  42%       { opacity: 0; }
  43%       { opacity: 1; transform: translateX(-2px); }
  44.5%     { opacity: 1; transform: translateX(1px); }
  45%       { opacity: 0; transform: translateX(0); }
  78%       { opacity: 0; }
  78.5%     { opacity: 0.7; transform: translateX(1px); }
  79.5%     { opacity: 0; transform: translateX(0); }
}

@keyframes glitch-flash-2 {
  0%, 100%  { opacity: 0; transform: translateX(0); }
  28%       { opacity: 0; }
  28.5%     { opacity: 0.8; transform: translateX(2px); }
  30%       { opacity: 0; transform: translateX(0); }
  63%       { opacity: 0; }
  63.5%     { opacity: 1; transform: translateX(-1px); }
  65%       { opacity: 0.5; transform: translateX(1px); }
  65.5%     { opacity: 0; transform: translateX(0); }
}

@keyframes glitch-flash-3 {
  0%, 100%  { opacity: 0; transform: translateY(0); }
  35%       { opacity: 0; }
  35.5%     { opacity: 0.6; transform: translateY(-1px); }
  37%       { opacity: 0; transform: translateY(0); }
  72%       { opacity: 0; }
  72.5%     { opacity: 0.9; transform: translateY(1px); }
  73.5%     { opacity: 0.3; transform: translateY(-1px); }
  74%       { opacity: 0; transform: translateY(0); }
}

/* Noise texture drift */
@keyframes noise-drift {
  0%   { transform: translate(0, 0); }
  25%  { transform: translate(-64px, -32px); }
  50%  { transform: translate(32px, -64px); }
  75%  { transform: translate(-32px, 64px); }
  100% { transform: translate(0, 0); }
}

/* Horizontal band drift */
@keyframes bands-drift {
  0%   { background-position: 0 0; }
  100% { background-position: 0 100vh; }
}
</style>
