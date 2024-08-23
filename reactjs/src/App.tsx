import { useRef, useEffect, useState, ChangeEvent } from "react";
import Webcam from "react-webcam";
import * as handpose from "@tensorflow-models/handpose";
import * as fp from "fingerpose";
import { drawHand } from "./utilities";
import { gestures } from "./gestures";
import "@tensorflow/tfjs-backend-webgl";

function App() {
  const webcamRef = useRef<Webcam>(null) as any;
  const canvasRef = useRef<HTMLCanvasElement>(null) as any;

  const [gesture, setGesture] = useState("");
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [gestureCounts, setGestureCounts] = useState<Record<string, number>>(
    {}
  );
  const [lastSign, setLastSign] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;

    const runHandpose = async () => {
      const net = await handpose.load();
      console.log("Handpose model loaded.");
      interval = setInterval(() => {
        detect(net);
      }, 1000);
    };

    runHandpose();

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    getVideoDevices();
  }, []);

  const detect = async (net: handpose.HandPose) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const hand = await net.estimateHands(video);
      try {
        const landmarks = hand[0]?.landmarks || [];
        if (landmarks.length > 0) {
          const GE = new fp.GestureEstimator(gestures);
          const gestureEstimation = GE.estimate(landmarks as any, 7.5);
          const sign = gestureEstimation.gestures.reduce(
            (max, obj) => (obj.score > max.score ? obj : max),
            { score: 0, name: '' } // Initial value
          );          

          if (gestureEstimation.gestures.length && sign) {
            const gestureName = sign.name;
            setGesture(gestureName);

            setGestureCounts((prevCounts) => {
              const newCounts = { ...prevCounts };
              if (gestureName in newCounts) {
                newCounts[gestureName]++;
              } else {
                newCounts[gestureName] = 1;
              }

              if (newCounts[gestureName] >= 10 && gestureName !== lastSign) {
                console.log(`Sign detected 10 times: ${gestureName}`);
                setLastSign(gestureName);
              }

              return newCounts;
            });
          } else {
            setGesture("No hand detected");
          }
        } else {
          setGesture("No hand detected");
        }
      } catch (error) {
        console.error("Error during gesture estimation:", error);
      }

      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand, ctx);
    }
  };

  const getVideoDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setVideoDevices(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedDevice(videoDevices[0].deviceId);
      }
    } catch (error) {
      console.error("Error getting video devices:", error);
    }
  };

  const handleDeviceChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedDevice(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <select value={selectedDevice} onChange={handleDeviceChange}>
          {videoDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
            </option>
          ))}
        </select>

        <Webcam
          ref={webcamRef}
          audio={false}
          videoConstraints={{
            deviceId: selectedDevice,
          }}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 640,
            height: 480,
            pointerEvents: "none", // Allows clicking through the canvas
          }}
        />
        <div style={{ position: "absolute", top: 500, fontSize: 24 }}>
          Detected Sign: {gesture}
        </div>
      </header>
    </div>
  );
}

export default App;
