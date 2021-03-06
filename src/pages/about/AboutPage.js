import Page from '@/components/Page';
import Header from '@/layouts/Header';
import { SettingOutlined } from '@ant-design/icons';
import React from 'react';
import { history, Link, Persist } from 'umi';
import styles from './AboutPage.less';

const About = () => (
  <Page name="about">
    <Header title="AboutPage" right={<SettingOutlined />} />
    <Persist />
    <div className={styles.root}>
      <p className={styles.title}>This is About ...</p>
      <Link className={styles.link} to="/test1">
        Goto Test1
      </Link>
      <Link className={styles.link} to="/about/test1">
        Goto About Test1
      </Link>
      <a className={styles.link} onClick={() => history.go(-1)}>
        Go back.
      </a>
    </div>
  </Page>
);

export default About;
