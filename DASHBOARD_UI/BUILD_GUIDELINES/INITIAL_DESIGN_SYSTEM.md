# SecretX Enterprise Management System Design Tokens

## Color Palette

```css
:root {
  --primary-gold: #fac306;
  --pure-black: #000000;
  --surface-dark: #0f0f0f;
  --surface-elevated: #1a1a1a;
  --border-color: #262626;
  --text-secondary: #a3a3a3;
  --emerald: #10b981;
  --danger-red: #ef4444;
}
```

### Color Usage

- **Primary Gold (#fac306)**: CTAs, active states, critical indicators, highlights
- **Pure Black (#000000)**: Background base
- **Surface Dark (#0f0f0f)**: Panel backgrounds with opacity (0.7)
- **Surface Elevated (#1a1a1a)**: Secondary background layers
- **Border Color (#262626)**: Panel borders, dividers
- **Text Secondary (#a3a3a3)**: Labels, secondary text
- **Emerald (#10b981)**: Success/healthy status indicators
- **Danger Red (#ef4444)**: Warnings, high-load states

---

## Typography System

### Font Families

- **UI Font**: General Sans (fallback: Inter)
- **Technical Font**: JetBrains Mono (for IDs, IPs, technical data)

### Font Weights & Scales

```
Headings:      General Sans Bold (700), 4xl-6xl size, 0-2% letter-spacing
Body:          General Sans Regular (400), sm-base, 0.5-1% letter-spacing
Labels:        General Sans Bold (600), xs-sm, uppercase, 0.2em tracking
Technical:     JetBrains Mono (400-700), xs-[9px], uppercase
```

---

## Component Library

### 1. Glass Panel

**Purpose**: Base container for all dashboard sections

```html
<div class="glass-panel rounded-2xl p-5">
  <!-- Content -->
</div>
```

**CSS Class**:

```css
.glass-panel {
  background: rgba(15, 15, 15, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid #262626;
}
```

**Variants**:

- `.gold-glow`: Adds gold shadow for critical sections
- `.hover:border-[#fac306]/50`: Hover state with gold accent

---

### 2. Navigation Bar

**Purpose**: Fixed top navigation with logo, links, and status indicator

**HTML Structure**:

```html
<nav
  class="h-16 fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-[#262626] flex items-center justify-between px-6"
>
  <!-- Logo Section -->
  <div class="flex items-center gap-3">
    <div
      class="w-8 h-8 bg-[#fac306] flex items-center justify-center rounded-sm"
    >
      <iconify-icon
        icon="lucide:shield-check"
        class="text-black text-xl font-bold"
      ></iconify-icon>
    </div>
    <span class="font-bold tracking-tighter text-xl"
      >SECRET<span class="text-[#fac306]">X</span></span
    >
  </div>

  <!-- Navigation Links -->
  <div
    class="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400"
  >
    <a href="#" class="text-white hover:text-white transition-standard"
      >Dashboard</a
    >
    <a href="#" class="hover:text-white transition-standard">Infrastructure</a>
    <a href="#" class="hover:text-white transition-standard">Security</a>
    <a href="#" class="hover:text-white transition-standard">Network</a>
    <a href="#" class="hover:text-white transition-standard">Activity Logs</a>
  </div>

  <!-- Status Pill & Profile -->
  <div class="flex items-center gap-4">
    <div
      class="bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800 flex items-center gap-2"
    >
      <div class="w-2 h-2 rounded-full bg-[#fac306] status-pulse"></div>
      <span
        class="text-[10px] font-technical font-bold text-zinc-300 uppercase tracking-widest"
        >Server: Online</span
      >
    </div>
    <div
      class="h-8 w-8 rounded-full border border-[#262626] bg-zinc-900 overflow-hidden cursor-pointer hover:border-[#fac306] transition-standard"
    >
      <img
        src="https://api.dicebear.com/7.x/shapes/svg?seed=Felix"
        alt="Profile"
        class="w-full h-full object-cover"
      />
    </div>
  </div>
</nav>
```

**Styling**:

- Height: 64px (h-16)
- Background: Black 80% opacity with backdrop blur
- Logo: 8x8 gold square with shield icon
- Status Pill: Zinc-900 background, gold pulsing dot

---

### 3. Stat Card

**Purpose**: Display key metrics with icons and status indicators

**HTML Template**:

```html
<div
  class="glass-panel rounded-2xl p-5 group hover:border-[#fac306]/50 transition-standard cursor-pointer"
>
  <!-- Header with Icon and Status -->
  <div class="flex justify-between items-start mb-6">
    <iconify-icon
      icon="lucide:cpu"
      class="text-3xl text-zinc-500 group-hover:text-[#fac306] transition-standard"
    ></iconify-icon>
    <span
      class="text-[10px] font-technical text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded uppercase font-bold"
      >Stable</span
    >
  </div>

  <!-- Value and Label -->
  <div class="space-y-1">
    <p class="text-3xl font-bold font-technical">
      12.4<span class="text-zinc-500 text-lg">GHz</span>
    </p>
    <p class="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
      Aggregated Clock
    </p>
  </div>
</div>
```

**Variants**:

- **Gold Accent**: Add `border-[#fac306]/30 bg-[#fac306]/5 gold-glow` for primary metrics
- **With Progress Bar**: Add progress bar for P2P connectivity card
- **Status Indicators**: Use `.bg-[#10b981]/10` for success, `.bg-red-500/5` for warnings

---

### 4. Filter Checkbox

**Purpose**: Custom checkbox for filtering options

**HTML**:

```html
<label class="flex items-center justify-between cursor-pointer group">
  <div class="flex items-center gap-3">
    <div
      class="w-4 h-4 rounded border border-zinc-700 bg-zinc-950 flex items-center justify-center group-hover:border-[#fac306] transition-standard"
    >
      <div class="w-2 h-2 bg-[#fac306] rounded-[1px]"></div>
    </div>
    <span
      class="text-sm text-zinc-300 group-hover:text-white transition-standard"
      >Compute Unit</span
    >
  </div>
  <span class="font-technical text-[10px] text-zinc-500">42</span>
</label>
```

**Styling**:

- Border: 1px zinc-700, 4x4px
- Checked: Show inner 2x2 gold square
- Hover: Border transitions to gold

---

### 5. Data Table

**Purpose**: Dense, technical data display with performance indicators

**HTML Structure**:

```html
<div class="overflow-x-auto custom-scrollbar glass-panel rounded-2xl">
  <!-- Header -->
  <div
    class="bg-black/40 border-b border-[#262626] px-6 py-4 flex items-center justify-between"
  >
    <div class="flex items-center gap-4">
      <h2 class="text-sm font-bold uppercase tracking-widest text-zinc-300">
        Provisioned Nodes
      </h2>
      <div
        class="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1 flex items-center gap-2"
      >
        <iconify-icon icon="lucide:search" class="text-zinc-500"></iconify-icon>
        <input
          type="text"
          placeholder="Filter by Node ID..."
          class="bg-transparent border-none text-xs text-white placeholder-zinc-600 focus:outline-none w-32"
        />
      </div>
    </div>
    <span class="text-[10px] text-zinc-500 font-technical"
      >Showing 8 of 104 entries</span
    >
  </div>

  <!-- Table Body -->
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="border-b border-zinc-800/50">
        <th
          class="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500"
        >
          Identify / Status
        </th>
        <th
          class="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500"
        >
          Internal Address
        </th>
        <th
          class="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500"
        >
          Load Profile
        </th>
        <th
          class="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500"
        >
          Latency
        </th>
        <th
          class="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 text-right"
        >
          Operation
        </th>
      </tr>
    </thead>
    <tbody class="divide-y divide-zinc-800/50">
      <tr class="hover:bg-zinc-900/30 transition-standard group">
        <td class="px-6 py-4">
          <div class="flex items-center gap-4">
            <div
              class="relative w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-[#fac306]/40 transition-standard"
            >
              <iconify-icon
                icon="lucide:server"
                class="text-zinc-400"
              ></iconify-icon>
              <div
                class="absolute -top-1 -right-1 w-3 h-3 bg-[#10b981] rounded-full border-2 border-black"
              ></div>
            </div>
            <div>
              <p class="text-sm font-bold tracking-tight">NODE-ALPHA-7</p>
              <p class="text-[10px] text-zinc-500 font-technical uppercase">
                Storage Class II
              </p>
            </div>
          </div>
        </td>
        <td class="px-6 py-4">
          <span class="font-technical text-xs text-zinc-300">10.0.0.124</span>
        </td>
        <td class="px-6 py-4 min-w-[140px]">
          <div class="space-y-1.5">
            <div
              class="flex justify-between text-[9px] font-bold text-zinc-500 uppercase"
            >
              <span>CPU</span>
              <span class="text-white">24%</span>
            </div>
            <div class="h-1 w-full bg-zinc-950 rounded-full overflow-hidden">
              <div class="h-full bg-[#fac306] w-[24%]"></div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4">
          <div class="flex items-center gap-1.5">
            <div class="w-1.5 h-1.5 rounded-full bg-[#10b981]"></div>
            <span class="text-xs font-technical text-zinc-300">4ms</span>
          </div>
        </td>
        <td class="px-6 py-4 text-right">
          <div class="flex items-center justify-end gap-2">
            <button
              class="px-3 py-1.5 bg-[#fac306] text-black text-[10px] font-bold rounded uppercase tracking-tighter hover:bg-[#fac306]/90 transition-standard"
            >
              Connect
            </button>
            <button
              class="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white transition-standard"
            >
              <iconify-icon icon="lucide:more-vertical"></iconify-icon>
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

**Row Features**:

- Icon with status dot overlay (top-right corner)
- Node identifier with class label
- IP address in technical font
- Performance sparkline (CPU/RAM %) with colored bar
- Latency indicator with status dot
- Action buttons (CONNECT + options menu)

---

### 6. Primary Button (CTA)

**Purpose**: Main call-to-action button

```html
<button
  class="px-4 py-2 bg-[#fac306] text-black rounded-lg text-sm font-bold hover:opacity-90 transition-standard flex items-center gap-2 gold-glow"
>
  <iconify-icon icon="lucide:plus-circle" class="text-lg"></iconify-icon>
  PROVISION NODE
</button>
```

**Styling**:

- Background: Gold (#fac306)
- Text: Black, bold, uppercase
- Hover: opacity-90
- Glow: 0 0 20px rgba(250, 195, 6, 0.15)

---

### 7. Secondary Button

**Purpose**: Alternative actions

```html
<button
  class="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-standard flex items-center gap-2"
>
  <iconify-icon icon="lucide:download"></iconify-icon>
  Export Data
</button>
```

**Styling**:

- Background: Zinc-900 with border
- Hover: bg-zinc-800
- Text: Small, medium weight

---

### 8. Security Alert Box

**Purpose**: Prominent warning notification

```html
<div class="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 space-y-3">
  <div class="flex items-center gap-2 text-red-500">
    <iconify-icon icon="lucide:alert-triangle" class="text-lg"></iconify-icon>
    <span class="text-[10px] font-bold uppercase tracking-widest"
      >Security Advisory</span
    >
  </div>
  <p class="text-xs text-zinc-400 leading-relaxed">
    Detected 3 unauthorized attempts on subnet
    <span class="text-zinc-200 font-technical">192.168.0.x</span>. Firewall
    rules auto-hardened.
  </p>
  <a
    href="#"
    class="block text-center py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-bold text-red-500 hover:bg-red-500/20 transition-standard uppercase tracking-tighter"
  >
    View Incident Report
  </a>
</div>
```

**Styling**:

- Background: Red with 5% opacity
- Border: Red with 20% opacity
- Text: Red and zinc-400 for content

---

### 9. Performance Sparkline

**Purpose**: Minimalist resource usage indicator

```html
<div class="min-w-[140px]">
  <div
    class="flex justify-between text-[9px] font-bold text-zinc-500 uppercase"
  >
    <span>CPU</span>
    <span class="text-white">24%</span>
  </div>
  <div class="h-1 w-full bg-zinc-950 rounded-full overflow-hidden">
    <div class="h-full bg-[#fac306] w-[24%]"></div>
  </div>
</div>
```

**Variants**:

- **Gold**: `bg-[#fac306]` (normal usage 0-60%)
- **Red**: `bg-red-500` (high usage 60-100%)
- **Emerald**: `bg-[#10b981]` (success state)

---

### 10. Status Indicator Dot

**Purpose**: Visual status representation

**Colors**:

- **Green (#10b981)**: Online/Healthy
- **Gold (#fac306)**: Attention/Active with pulse
- **Red (#ef4444)**: Critical/Error
- **Gray**: Offline/Inactive

**Pulsing Animation**:

```css
.status-pulse {
  animation: status-pulse 2s infinite ease-in-out;
}

@keyframes status-pulse {
  0% {
    transform: scale(0.95);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.5;
  }
}
```

---

## Interaction & Animation

### Transition Standard

```css
.transition-standard {
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Hover States

- **Panel Hover**: Border transitions to gold accent
- **Button Hover**: Opacity reduces to 0.9
- **Link Hover**: Text color transitions to white
- **Icon Hover**: Color transitions to gold

### Focus States

- Input fields: `focus:border-[#fac306]`
- Buttons: `active:scale-95` transform

---

## Layout Grid

### Container

- Max-width: 1600px
- Padding: 24px (p-6)
- Gap between sections: 32px

### Stat Grid

- 5 columns on desktop
- 4 columns on 1024px+
- 2 columns on tablet
- 1 column on mobile
- Gap: 16px

### Table

- Fixed header
- Horizontal scroll for mobile
- Row height: 48px-64px

---

## Spacing Scale

```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
```

---

## Border Radius

- **Large**: 16px (2xl) - Panels, cards, large containers
- **Medium**: 8px (lg) - Buttons, inputs, interactive elements
- **Small**: 4px (sm) - Small UI elements

---

## Z-Index Scale

- Modal/Overlay: 100
- Navigation: 50
- Default: 0
- Background: -10

---

## Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px
- Large: > 1600px (container max-width)

---

## Complete CSS Styling Reference

### Core CSS Variables & Base Styles

```css
:root {
  --primary-gold: #fac306;
  --pure-black: #000000;
  --surface-dark: #0f0f0f;
  --surface-elevated: #1a1a1a;
  --border-color: #262626;
  --text-secondary: #a3a3a3;
  --emerald: #10b981;
  --danger-red: #ef4444;
}

body {
  font-family: "General Sans", "Inter", sans-serif;
  background-color: var(--pure-black);
  color: white;
  overflow-x: hidden;
}

.font-technical {
  font-family: "JetBrains Mono", monospace;
}

.transition-standard {
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

### 1. Glass Panel Styling

```css
.glass-panel {
  background: rgba(15, 15, 15, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid #262626;
  border-radius: 1rem; /* 16px */
  padding: 1.25rem; /* 20px */
}

.glass-panel:hover {
  border-color: #fac306;
  border-color: rgba(250, 195, 6, 0.5);
}

.glass-panel.gold-glow {
  box-shadow: 0 0 20px rgba(250, 195, 6, 0.15);
  border-color: rgba(250, 195, 6, 0.3);
  background-color: rgba(250, 195, 6, 0.05);
}
```

---

### 2. Navigation Bar Styling

```css
nav.navbar {
  height: 4rem; /* 64px */
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 50;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #262626;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem; /* px-6 */
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem; /* gap-3 */
}

.logo-icon {
  width: 2rem;
  height: 2rem;
  background: #fac306;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem; /* rounded-sm */
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.05em;
}

.navbar-links {
  display: flex;
  gap: 2rem; /* gap-8 */
  font-size: 0.875rem;
  font-weight: 500;
  color: #d4d4d8;
}

.navbar-links a {
  color: #d4d4d8;
  text-decoration: none;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar-links a:hover {
  color: white;
}

.status-pill {
  background: #18181b;
  padding: 0.375rem 0.75rem; /* py-1.5 px-3 */
  border-radius: 9999px;
  border: 1px solid #27272a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #d4d4d8;
}

.profile-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 1px solid #262626;
  background: #18181b;
  overflow: hidden;
  cursor: pointer;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.profile-avatar:hover {
  border-color: #fac306;
}
```

---

### 3. Stat Card Styling

```css
.stat-card {
  border-radius: 1rem;
  padding: 1.25rem;
  background: rgba(15, 15, 15, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid #262626;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.stat-card:hover {
  border-color: rgba(250, 195, 6, 0.5);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.stat-icon {
  font-size: 1.875rem;
  color: #71717a;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover .stat-icon {
  color: #fac306;
}

.stat-badge {
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  font-family: "JetBrains Mono", monospace;
}

.stat-unit {
  color: #71717a;
  font-size: 1.125rem;
}

.stat-label {
  font-size: 0.625rem;
  color: #71717a;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
  margin-top: 0.25rem;
}

/* Stat Card with Gold Accent Variant */
.stat-card.gold-accent {
  border: 1px solid rgba(250, 195, 6, 0.3);
  background: rgba(250, 195, 6, 0.05);
  box-shadow: 0 0 20px rgba(250, 195, 6, 0.15);
}
```

---

### 4. Filter Checkbox Styling

```css
.filter-checkbox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.checkbox-input {
  width: 1rem;
  height: 1rem;
  border: 1px solid #3f3f46;
  background: #09090b;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.checkbox-input:hover {
  border-color: #fac306;
}

.checkbox-input.checked::after {
  content: "";
  width: 0.5rem;
  height: 0.5rem;
  background: #fac306;
  border-radius: 0.0625rem;
  display: block;
}

.checkbox-label {
  font-size: 0.875rem;
  color: #d4d4d8;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-checkbox:hover .checkbox-label {
  color: white;
}

.checkbox-count {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.625rem;
  color: #71717a;
}
```

---

### 5. Data Table Styling

```css
.table-container {
  border-radius: 1rem;
  overflow: hidden;
  background: rgba(15, 15, 15, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid #262626;
}

.table-header {
  background: rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid #262626;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table-title {
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #d4d4d8;
}

.table-search {
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 0.5rem;
  padding: 0.25rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.table-search input {
  background: transparent;
  border: none;
  color: white;
  font-size: 0.75rem;
  outline: none;
}

.table-search input::placeholder {
  color: #52525b;
}

.table {
  width: 100%;
  text-align: left;
  border-collapse: collapse;
}

.table thead th {
  padding: 1rem 1.5rem;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #71717a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.table tbody tr {
  border-bottom: 1px divide rgba(255, 255, 255, 0.05);
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.table tbody tr:hover {
  background: rgba(24, 24, 27, 0.3);
}

.table td {
  padding: 1rem 1.5rem;
}

.node-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.node-icon {
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background: #18181b;
  border: 1px solid #27272a;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.node-cell:hover .node-icon {
  border-color: rgba(250, 195, 6, 0.4);
}

.status-dot {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  border: 2px solid black;
}

.node-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.node-name {
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.node-class {
  font-size: 0.625rem;
  color: #71717a;
  font-family: "JetBrains Mono", monospace;
  text-transform: uppercase;
}

.ip-address {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.75rem;
  color: #d4d4d8;
}

.performance-bar {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 8.75rem;
}

.performance-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.5625rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #71717a;
}

.performance-track {
  width: 100%;
  height: 0.25rem;
  background: #18181b;
  border-radius: 9999px;
  overflow: hidden;
}

.performance-fill {
  height: 100%;
  background: #fac306;
  border-radius: 9999px;
  transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.performance-fill.high-load {
  background: #ef4444;
}

.performance-fill.success {
  background: #10b981;
}

.latency-indicator {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.latency-dot {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
}

.latency-value {
  font-size: 0.75rem;
  font-family: "JetBrains Mono", monospace;
  color: #d4d4d8;
}

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
}

.connect-btn {
  padding: 0.375rem 0.75rem;
  background: #fac306;
  color: black;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.025em;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.connect-btn:hover {
  background: rgba(250, 195, 6, 0.9);
}

.connect-btn:disabled {
  background: #27272a;
  color: #71717a;
  cursor: not-allowed;
}

.options-btn {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #71717a;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.options-btn:hover {
  color: white;
}
```

---

### 6. Button Styling

```css
.btn-primary {
  padding: 0.5rem 1rem;
  background: #fac306;
  color: black;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 0 20px rgba(250, 195, 6, 0.15);
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-primary:active {
  transform: scale(0.95);
}

.btn-secondary {
  padding: 0.5rem 1rem;
  background: #18181b;
  color: white;
  border: 1px solid #27272a;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-secondary:hover {
  background: #27272a;
}
```

---

### 7. Security Alert Box Styling

```css
.alert-security {
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 1rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.alert-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ef4444;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.alert-message {
  font-size: 0.75rem;
  color: #a1a1a1;
  line-height: 1.5;
}

.alert-link {
  display: block;
  text-align: center;
  padding: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 0.5rem;
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.025em;
  text-decoration: none;
  cursor: pointer;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.alert-link:hover {
  background: rgba(239, 68, 68, 0.2);
}
```

---

### 8. Scrollbar Styling

```css
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #000000;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #262626;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #fac306;
}
```

---

### 9. Status Pulse Animation

```css
.status-pulse {
  animation: status-pulse 2s infinite ease-in-out;
}

@keyframes status-pulse {
  0% {
    transform: scale(0.95);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.5;
  }
}
```

---

### 10. Responsive Utilities

```css
/* Desktop Layout */
@media (min-width: 1024px) {
  .navbar-links {
    display: flex;
  }

  .stat-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  .split-view {
    flex-direction: row;
  }
}

/* Tablet Layout */
@media (min-width: 640px) and (max-width: 1023px) {
  .navbar-links {
    display: none;
  }

  .stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .split-view {
    flex-direction: column;
  }
}

/* Mobile Layout */
@media (max-width: 639px) {
  .navbar-links {
    display: none;
  }

  .stat-grid {
    grid-template-columns: 1fr;
  }

  .status-pill {
    display: none;
  }

  .split-view {
    flex-direction: column;
  }

  .table-container {
    overflow-x: auto;
  }
}
```
