"use client";

import { useState, useEffect } from "react";
import { languages } from "@/lib/languages";
import {
  Button,
  Select,
  Input,
  Card,
  Space,
  Typography,
  Alert,
  Divider,
  Tag,
  List,
} from "antd";
import { SearchOutlined, HistoryOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

type DictionaryDefinition = {
  id?: number;
  word: string;
  definition: string;
  language: string;
  partOfSpeech?: string;
  examples?: string;
  createdAt?: Date | string;
};

export default function Dictionary() {
  const [word, setWord] = useState("");
  const [language, setLanguage] = useState("vi");
  const [definition, setDefinition] = useState<DictionaryDefinition | null>(
    null
  );
  const [recentLookups, setRecentLookups] = useState<DictionaryDefinition[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRecentLookups();
  }, []);

  const fetchRecentLookups = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch("/api/dictionary/history");
      if (!response.ok) {
        throw new Error("Failed to fetch history");
      }
      const data = await response.json();
      setRecentLookups(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleLookup = async () => {
    if (!word.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/dictionary?word=${encodeURIComponent(word)}&language=${language}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Lookup failed");
      }

      setDefinition(data);
      fetchRecentLookups();
    } catch {
      setError("Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLookup = (item: DictionaryDefinition) => {
    setDefinition(item);
    setWord(item.word);
    setLanguage(item.language);
  };

  return (
    <Card
      className="w-full mb-8"
      title={<Title level={4}>Dictionary Lookup</Title>}
      bordered={false}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Space className="w-full">
          <Input
            placeholder="Enter a word"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onPressEnter={handleLookup}
            style={{ flex: 1 }}
          />

          <Select
            value={language}
            onChange={setLanguage}
            style={{ width: 150 }}
            options={languages.map((lang) => ({
              value: lang.code,
              label: lang.name,
            }))}
          />

          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleLookup}
            loading={isLoading}
            disabled={!word.trim()}
          >
            Lookup
          </Button>
        </Space>

        {error && <Alert type="error" message={error} />}

        {definition && (
          <Card className="bg-gray-50">
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <Title level={4}>{word}</Title>

              {definition.partOfSpeech && (
                <Tag color="blue">{definition.partOfSpeech}</Tag>
              )}

              <Paragraph>{definition.definition}</Paragraph>

              {definition.examples && (
                <>
                  <Divider orientation="left">Examples</Divider>
                  <Paragraph italic>{definition.examples}</Paragraph>
                </>
              )}
            </Space>
          </Card>
        )}

        <Divider orientation="left">
          <Space>
            <HistoryOutlined />
            <span>Recent Lookups</span>
          </Space>
        </Divider>

        <List
          loading={isLoadingHistory}
          dataSource={recentLookups}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              onClick={() => handleSelectLookup(item)}
              style={{ cursor: "pointer" }}
            >
              <List.Item.Meta
                title={<span>{item.word}</span>}
                description={
                  <Space>
                    <Tag color="blue">{item.language}</Tag>
                    <span>
                      {new Date(item.createdAt as string).toLocaleString()}
                    </span>
                  </Space>
                }
              />
            </List.Item>
          )}
          locale={{ emptyText: "No data" }}
        />
      </Space>
    </Card>
  );
}
