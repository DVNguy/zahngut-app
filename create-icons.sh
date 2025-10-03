#!/bin/bash

# Create a simple SVG icon
cat > /tmp/cc-agent/57975241/project/public/icons/icon.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0891b2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#grad)" rx="80"/>
  <text x="256" y="320" font-size="280" text-anchor="middle" fill="white">🦷</text>
</svg>
EOF

# Create placeholder PNG files (these would normally be generated from SVG)
# For demonstration, we'll just copy a reference to the SVG
cd /tmp/cc-agent/57975241/project/public/icons
for size in 72 96 128 144 152 192 384 512; do
  cp icon.svg icon-${size}.png
done

echo "Icon placeholders created"
