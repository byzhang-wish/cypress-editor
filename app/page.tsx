'use client';

import { v4 } from 'uuid';

import { useCallback, useEffect, useState } from 'react';
import { Button, ConfigProvider, Layout, Menu, Popover, Space } from 'antd';
import { PlusCircleOutlined, CloseOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;

import { lusitana, zcool } from '@/app/ui/fonts';
import Image from 'next/image';
import CypressLogo from '@/public/cypress.svg';

import Case from '@/app/ui/case/case';
import { heartbeat } from '@/app/lib/mock-server';

export default function Home() {

  const [mockServerPop, mockServerPopUpdate] = useState(false);

  const pop = () => {
    mockServerPopUpdate(true);
    setTimeout(() => { mockServerPopUpdate(false) }, 3000);
  }

  const [mockServerAlive, mockServerAliveUpdate]: [boolean | null, any] = useState(null);

  const alive = async () => {
    const now = await heartbeat();
    mockServerAliveUpdate((prevState: boolean | null) => {
      if (now !== prevState) pop();
      return now;
    })
  };

  const $alive = async () => {
    await alive();
    setInterval(alive, 10000);
  }

  const [testCaseIdList, testCaseIdListUpdate]: [string[], any] = useState([]);

  const [activeTestCaseId, activeTestCaseIdUpdate] = useState('');

  const [testCaseItems, testCaseItemsUpdate]: [any[], any] = useState([]);

  const newTestCaseItem = useCallback((id: string, name: string = '') => {
    return {
      key: id,
      title: id,
      label: <div
        className={`${lusitana.className}`}
        style={{ fontSize: 15, color: 'rgb(230,230,230)' }}
        onClick={() => activeTestCaseIdUpdate(id)}
      >
        {`Case${name ? ` - ${name}` : ''}\t`}
        <Button
          shape='circle'
          size='small'
          style={{ background: 'rgb(0, 0, 0)' }}
          icon={<CloseOutlined />}
          onClick={($) => { $.stopPropagation(); onDeleteTestCase(id); }}
        />
      </div>,
    }
  }, []);

  const updateTestCaseItemName = (id: string, name: string) => {
    const changedItem = newTestCaseItem(id, name);
    testCaseItemsUpdate((prevList: any) => prevList.map(
      (testCaseItem: any) => testCaseItem.key === id ? changedItem : testCaseItem
    ));
  }

  const onDeleteTestCase = (id: string) => {
    testCaseIdListUpdate((prevList: any) => prevList.filter((testCaseId: string) => testCaseId !== id));
    testCaseItemsUpdate((prevList: any) => {
      const leftIndex = prevList.findIndex((testCaseItem: any) => testCaseItem.key === id) - 1;
      if (leftIndex > -1) activeTestCaseIdUpdate((prevState: string) => prevState === id ? prevList[leftIndex].key : prevState);
      return prevList.filter((testCaseItem: any) => testCaseItem.key !== id);
    });
  }

  const onAddTestCase = useCallback(() => {
    const newId = v4();
    const newItem = newTestCaseItem(newId);
    testCaseIdListUpdate((prevList: any) => [...prevList, newId]);
    testCaseItemsUpdate((prevList: any) => [...prevList, newItem]);
    activeTestCaseIdUpdate(newId);
  }, [newTestCaseItem])

  useEffect(() => {
    onAddTestCase();
    const handleBeforeUnload = (event: any) => event.preventDefault();
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [onAddTestCase]);

  return (
    <main className="flex flex-col min-h-screen">
      <ConfigProvider
        theme={{
          token: {
            borderRadiusLG: 6,
            colorBorder: 'rgb(0, 0, 0)',
            colorBorderSecondary: 'rgb(0, 0, 0)',
            colorSplit: 'rgb(0, 0, 0)',
            colorText: 'rgb(0, 0, 0)',
            colorPrimary: 'rgb(230, 230, 230)',
            fontSize: 14
          },
          components: {
            Menu: {
              colorText: 'rgb(230, 230, 230)',
              itemSelectedBg: 'rgb(0, 0, 0)',
              popupBg: 'rgb(0, 0, 0)'
            },
            Popover: {
              borderRadiusLG: 0,
              colorBgElevated: 'rgb(230, 230, 230)'
            }
          }
        }}
      >
        <Layout>
          <Header style={{ display: 'flex', alignItems: 'center', background: 'rgb(0, 0, 0)' }}>
            <Button type='primary' shape='circle' size='large' style={{ background: 'rgb(0, 0, 0)' }} icon={<PlusCircleOutlined style={{ fontSize: 23, color: 'rgb(255, 255, 255)' }} />} onClick={onAddTestCase} />
            <Menu
              mode="horizontal"
              items={testCaseItems}
              selectedKeys={[activeTestCaseId]}
              style={{ flex: 1, background: 'rgb(0, 0, 0)' }}
            />
            <Popover
              open={mockServerPop}
              content={
                <div
                  className={`${zcool.className}`}
                  style={{ fontSize: 14 }}
                >
                  {
                    mockServerAlive ?
                      <div style={{ color: 'green' }}><Space><CheckCircleOutlined />{'Connected'}</Space></div>
                      :
                      <div style={{ color: 'red' }}><Space><InfoCircleOutlined />{'Disconnected'}</Space></div>
                  }
                </div>
              }
              placement='bottomLeft'
            >
              <Image src={CypressLogo} alt='Cypress' width={40} priority={true} onLoad={$alive} style={{ filter: mockServerAlive ? 'grayscale(0%)' : 'grayscale(100%)' }} />
            </Popover>
          </Header>
          <Content
            style={{
              padding: '30 30',
              background: 'rgb(255, 255, 255)',
              borderRadius: 'rgb(255, 255, 255)'
            }}>
            <div
              style={{
                minHeight: 280,
                padding: 20,
                background: 'rgb(255, 255, 255)',
                borderRadius: 'rgb(255, 255, 255)'
              }}
            >
              {testCaseIdList.map(
                testCaseId =>
                  <div key={testCaseId} style={{ display: testCaseId === activeTestCaseId ? 'block' : 'none' }}>
                    <Case id={testCaseId} uploadName={updateTestCaseItemName} />
                  </div>
              )}
            </div>
          </Content>
        </Layout>
      </ConfigProvider>
    </main >
  );
};