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
  const [isWebcamOn, setIsWebcamOn] = useState(true);

  useEffect(() => {
    let interval: any;

    const runHandpose = async () => {
      const net = await handpose.load();
      console.log("Handpose model loaded.");
      interval = setInterval(() => {
        detect(net);
      }, 2000);
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
            { score: 0, name: "" } // Initial value
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

  const toggleWebcam = () => {
    setIsWebcamOn(!isWebcamOn);
  };
  useEffect(() => {
    if (gesture != "No hand detected") {
      switch (gesture) {
        case "B":
          fetch("http://localhost:7000/audio");
          break;
        case "A":
          fetch("http://localhost:7000/meeting");
          break;

        default:
          break;
      }
    }
  }, [gesture]);
  return (
    <div
      className="App"
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h3 style={{ textAlign: "center", color: "white" }}>
        Hand Gesture Recognition
      </h3>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div>
          <label htmlFor="camera-select" style={{ marginRight: "10px" }}>
            Select Camera:
          </label>
          <select
            id="camera-select"
            value={selectedDevice}
            onChange={handleDeviceChange}
            style={{ padding: "5px", borderRadius: "5px" }}
          >
            {videoDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={toggleWebcam}
          style={{
            padding: "10px 20px",
            backgroundColor: isWebcamOn ? "#f44336" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {isWebcamOn ? "Turn Off Webcam" : "Turn On Webcam"}
        </button>
      </div>

      <div
        style={{
          position: "relative",
          height: "50vh",
          margin: "0 auto",
          border: "2px solid #ddd",
          borderRadius: "10px",
          overflow: "hidden",
          aspectRatio: "16/9",
        }}
      >
        {isWebcamOn && (
          <>
            <Webcam
              ref={webcamRef}
              audio={false}
              videoConstraints={{
                deviceId: selectedDevice,
              }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            />
          </>
        )}
        {!isWebcamOn && (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f0f0f0",
              fontSize: "18px",
              color: "#666",
            }}
          >
            Webcam is turned off
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#f0f0f0",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <h2 style={{ margin: "0 0 10px 0", color: "#333" }}>Detected Sign</h2>
        <p style={{ fontSize: "24px", fontWeight: "bold", color: "#4CAF50" }}>
          {gesture || "No hand detected"}
        </p>
      </div>
    </div>
  );
}

export default App;
