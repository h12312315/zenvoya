# Zenvoya Leveling System

A gamified progression system to motivate users to plan, book, and travel more. Every user has a level (1–10), shown across the app as `Lv {level}. {title}`.

| Level | Title | Quantitative Thresholds (To Unlock) | Tier |
| :--- | :--- | :--- | :--- |
| **1** | **Passenger** | Complete quiz + import 1 link | **Tier 1: Observer** (Low Frequency) |
| **2** | **Watcher** | Add 5 items to a draft timeline | **Tier 1: Observer** (Low Frequency) |
| **3** | **Tracker** | Set 3 price alerts + 1 booking reminder | **Tier 2: Committer** (Active Planning) |
| **4** | **Catalyst** | Complete 1 successful booking via app | **Tier 2: Committer** (Active Planning) |
| **5** | **Anchor** | Invite 2 friends to a trip + sync 1 shared calendar | **Tier 2: Committer** (Active Planning) |
| **6** | **Tracer** | Hit "Record" on 1 trip + log 10 GPS check-ins | **Tier 3: Experiencer** (On-Trip) |
| **7** | **Curator** | Complete a trip with 0 timeline gaps + accept 3 real-time recs | **Tier 3: Experiencer** (On-Trip) |
| **8** | **Purist** | Unlock 3 distinct AI personality archetypes | **Tier 4: Legend** (High Frequency) |
| **9** | **Architect** | Have 1 exported footprint map saved or copied by someone else | **Tier 4: Legend** (High Frequency) |
| **10** | **Agent** | Execute 4 trips/year + lead 3 group trips + use full automation | **Tier 4: Legend** (High Frequency) |

## Where it's implemented

In `zenvoya-prototype.html`:

- `LEVELS` — the array above (level, title, tier), used for lookups. Unlock thresholds are documentation-only for now and not enforced in the prototype.
- `levelTitle(level)` / `levelLabel(level)` — return the title / full `Lv {n}. {title}` string for a level.
- `ME` and each entry in `FRIENDS` carry a `level` and `joinDate` field — the single source of truth for a person's level everywhere in the app (leaderboard, trip member avatars, nav footer).
- `avatarTooltipHTML(person)` — shared hover-tooltip markup (name, join date, level) attached to any avatar via the `avatar-tt` class.
- `stackAvatarHTML(m)` / `friendAvatarHTML(f)` — shared avatar renderers used everywhere a person's avatar appears, so the tooltip and level are automatically wired in.

## Where it's shown in the UI

1. **Left nav** — small badge after the user's name at the bottom of the sidebar (`.user-level-badge`, populated by `renderUserFooter()`).
2. **Activity leaderboard** (Home page) — level shown under each person's name (`.leaderboard-level`).
3. **Avatar hover tooltip** — hovering any avatar (trip members, leaderboard, friends list, activity feed) shows name, join date, and level.
