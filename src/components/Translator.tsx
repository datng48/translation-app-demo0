"use client";

import { useState, useEffect } from "react";
import { languages } from "@/lib/languages";
import { Button, Select, Input, Alert } from "antd";
import { SwapOutlined, GlobalOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export default function Translator() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("auto");
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("vi");
  const [isLoading, setIsLoading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const detectLanguage = async () => {
      if (sourceText.trim() && sourceLanguage === "auto") {
        setIsDetecting(true);

        try {
          const response = await fetch("/api/detect-language", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: sourceText }),
          });

          if (!response.ok) {
            throw new Error("Language detection failed");
          }

          const data = await response.json();
          setDetectedLanguage(data.detectedLanguage);
        } catch (err) {
          console.error("Error detecting language:", err);
        } finally {
          setIsDetecting(false);
        }
      }
    };

    const debounceTimer = setTimeout(() => {
      detectLanguage();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [sourceText, sourceLanguage]);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    setIsLoading(true);
    setError("");

    const actualSourceLanguage =
      sourceLanguage === "auto" ? detectedLanguage || "en" : sourceLanguage;

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: sourceText,
          sourceLanguage: actualSourceLanguage,
          targetLanguage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Translation failed");
      }

      setTranslatedText(data.translatedText);
    } catch (err) {
      setError("Translation failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwap = () => {
    if (sourceLanguage === "auto") {
      return;
    }

    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);

    if (translatedText) {
      setSourceText(translatedText);
      setTranslatedText(sourceText);
    }
  };

  const getSourceLanguageDisplay = () => {
    if (sourceLanguage !== "auto") {
      return null;
    }

    if (isDetecting) {
      return <span className="text-gray-500 text-xs ml-2">Detecting...</span>;
    }

    if (detectedLanguage && sourceText.trim()) {
      const detectedName =
        languages.find((l) => l.code === detectedLanguage)?.name ||
        detectedLanguage;
      return (
        <span className="text-gray-500 text-xs ml-2">
          Detected: {detectedName}
        </span>
      );
    }

    return null;
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <Select
            value={sourceLanguage}
            onChange={setSourceLanguage}
            className="w-40"
            options={languages.map((lang) => ({
              value: lang.code,
              label: lang.name,
            }))}
            bordered={false}
            suffixIcon={sourceLanguage === "auto" ? <GlobalOutlined /> : null}
          />
          {getSourceLanguageDisplay()}
        </div>

        <Button
          type="primary"
          shape="circle"
          icon={<SwapOutlined />}
          onClick={handleSwap}
          size="large"
          className="mx-2"
          disabled={sourceLanguage === "auto"}
        />

        <Select
          value={targetLanguage}
          onChange={setTargetLanguage}
          className="w-40"
          options={languages
            .filter((lang) => lang.code !== "auto")
            .map((lang) => ({ value: lang.code, label: lang.name }))}
          bordered={false}
          suffixIcon={null}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <TextArea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Enter text to translate"
            rows={6}
            className="w-full"
            bordered={true}
          />
        </div>

        <div>
          <TextArea
            value={translatedText}
            readOnly
            placeholder="Translation will appear here"
            rows={6}
            className="w-full bg-gray-50"
            bordered={true}
          />
        </div>
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}

      <div className="flex justify-start">
        <Button
          type="primary"
          onClick={handleTranslate}
          disabled={isLoading || !sourceText.trim()}
          loading={isLoading}
        >
          Translate
        </Button>
      </div>
    </div>
  );
}
