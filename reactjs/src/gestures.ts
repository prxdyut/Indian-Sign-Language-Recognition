// src/gestures.js
import {
  Finger,
  FingerCurl,
  FingerDirection,
  GestureDescription,
} from "fingerpose";

// ASL Alphabet - 14 common and easily detectable signs
const aSign = new GestureDescription("A");
const bSign = new GestureDescription("B");
const cSign = new GestureDescription("C");
const dSign = new GestureDescription("D");
const eSign = new GestureDescription("E");
const iSign = new GestureDescription("I");
const lSign = new GestureDescription("L");
const rSign = new GestureDescription("R");
const uSign = new GestureDescription("U");
const vSign = new GestureDescription("V");
const wSign = new GestureDescription("W");
const ySign = new GestureDescription("Y");
const sSign = new GestureDescription("S");

// Describe A sign
aSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
aSign.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
aSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
aSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
aSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// Describe B sign
bSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
bSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
bSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
bSign.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);
bSign.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);

// Describe C sign
cSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
cSign.addCurl(Finger.Index, FingerCurl.HalfCurl, 1.0);
cSign.addCurl(Finger.Middle, FingerCurl.HalfCurl, 1.0);
cSign.addCurl(Finger.Ring, FingerCurl.HalfCurl, 1.0);
cSign.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 1.0);

// Describe D sign
dSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
dSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
dSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
dSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
dSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// Describe E sign
eSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
eSign.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
eSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
eSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
eSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// Describe I sign
iSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
iSign.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
iSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
iSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
iSign.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);

// Describe L sign
lSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
lSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
lSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
lSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
lSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// Describe R sign
rSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
rSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
rSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
rSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
rSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// Describe U sign
uSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
uSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
uSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
uSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
uSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// Describe V sign
vSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
vSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
vSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
vSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
vSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// Describe W sign
wSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
wSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
wSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
wSign.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);
wSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// Describe Y sign
ySign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
ySign.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
ySign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
ySign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
ySign.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);

// Describe S sign
sSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
sSign.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
sSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
sSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
sSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

export const gestures = [
  aSign,
  bSign,
  iSign,
  lSign,
  wSign
];
