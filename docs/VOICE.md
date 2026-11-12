# Teacher narration (🎙 शिक्षक · Teacher)

One tap on **🎙 शिक्षक · Teacher** (top bar, next to 3D | 2D) makes the app explain the **current topic** like a
teacher: Hindi, English or both; **सर** (male) or **मैडम** (female); play / pause / previous / next part.

## What is spoken
1. Greeting, topic name.
2. **Hook + core idea** — hand-written, one per chapter / topic group (35 in all) in `assets/va-voice-data.js`,
   with Jharkhand examples (Netarhat, Hundru Falls, Jaduguda, Ghatsila, Sarhul, Palash, Sal forests …).
3. The topic's own lesson text — intro, **every step** (the 3D model jumps to that step while it is spoken),
   **every label** (the label is highlighted with the arrow while its name is said), real-life facts.
4. In **2D** mode: the picture's description, then labels 1…N one by one with the arrow.
5. A "think for a moment" question and a closing line.

Formulas, units and symbols are converted to speakable words (`H₂O` → "एच टू ओ", `m/s` → "मीटर प्रति सेकंड",
`10⁸` → "10 घात 8").

## Cost and offline
Zero. The voices are the ones already installed on the device (Web Speech API). Nothing is sent to any server.

## Getting the best voice
| Device | Best option |
|---|---|
| Windows + **Edge** | "Microsoft Madhur / Swara Online (Natural) – Hindi", "Prabhat / Neerja – English (India)" (free, very natural; need internet) |
| Windows + Chrome | Settings → Time & language → Speech → Add voices → Hindi |
| Android | Settings → Text-to-speech → Google → Hindi (download the voice data) |
| iPad / Mac | Settings → Accessibility → Spoken Content → Voices → Hindi (Lekha / Kalpana) |

Open **⚙** to pick the Hindi / English voice, speed and **गहराई (depth)**. A device may not have a male Hindi voice;
the app then lowers the pitch of the available voice for **सर**. Voices marked ☁ need internet.

## Real human voice (recommended for the final classroom version)
Machine voices are good, but a real teacher is better. Record a topic on a phone (mp3/m4a, speak at your own pace),
copy it to `assets/voice/` and list it in `assets/voice/index.json`:

```json
{ "clips": { "ch11-ohm.hi": "ch11-ohm.hi.mp3", "ch11-ohm.en": "ch11-ohm.en.mp3", "ch11-ohm.both": "ch11-ohm.both.mp3" } }
```
Key = topic key with `/` replaced by `-` (e.g. `ch11/ohm` → `ch11-ohm`) + `.hi`, `.en` or `.both`.
When a clip exists for the chosen language the app plays it instead of the synthetic voice.
Keep files small (mono, 64 kbit/s ≈ 0.5 MB per minute).

## Editing the words
`assets/va-voice-data.js` — one entry per chapter: `h` (hook) and `i` (idea), each `[Hindi, English]`. They are written
gender-neutral ("हम समझते हैं") so the same text suits both voices.

## GitHub repositories evaluated (metadata only; nothing from them is installed)
| Repository | Licence | Why not used |
|---|---|---|
| `anmol-shrivastav/tts-hindi` (Piper, Node) | MIT | needs a server → running cost |
| `rhulha/StreamingKokoroJS`, `met4citizen/HeadTTS` (Kokoro in the browser) | Apache-2.0 / MIT | ~90 MB model downloaded from Hugging Face; Hindi quality unverified; could not be tested in the build environment |
| `praxelhq/praxy` (Indic TTS) | NOASSERTION | licence unclear |
| `udgamlabs/shruti` | Apache-2.0 | speech-to-text, not narration |

A neural voice pack can be added later behind the same player if a school has the bandwidth; the app is a static
site with no third-party code today, which keeps it free, fast and offline-ready.
