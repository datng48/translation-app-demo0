"use client";

import Dictionary from "@/components/Dictionary";
import Translator from "@/components/Translator";
import { Layout, Typography, Tabs } from "antd";
import { useState } from "react";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function Home() {
  const [activeTab, setActiveTab] = useState("translate");
  const items = [
    {
      key: "translate",
      label: "Translate",
      children: <Translator />,
    },
    {
      key: "dictionary",
      label: "Dictionary",
      children: <Dictionary />,
    },
  ];

  return (
    <Layout className="min-h-screen h-screen flex flex-col">
      <Content className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50">
        <header className="text-center mb-8">
          <Title level={2}>Demo Translator</Title>
          <Text type="secondary">Translate text</Text>
        </header>

        <main className="w-full max-w-3xl mx-auto">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={items}
            className="translator-tabs"
          />
        </main>
      </Content>
    </Layout>
  );
}
