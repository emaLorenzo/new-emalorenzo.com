/* eslint-disable sort-keys */
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';

import { Head, MDX, Title } from '@/components';
import { MainLayout } from '@/layouts';
import { getMDX, listFiles } from '@/lib/cms';
import type { NextPageWithLayout } from '@/types';

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 100%;
  max-width: 1200px;
  flex: 1;
  margin-top: 100px;
  padding-bottom: calc(var(--gap) * 8);
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
`;

const Article = styled(motion.article)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ArticlePage: NextPageWithLayout = ({ mdx, metadata }: any) => {
  const { title, image } = metadata;
  return (
    <Wrapper>
      <Head />
      <ImageWrapper>
        <Image src={image} layout="fill" objectFit="cover" />
      </ImageWrapper>
      <Title>{title}</Title>
      <Article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.7 }}
      >
        <MDX source={mdx} />
      </Article>
    </Wrapper>
  );
};

ArticlePage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export const getStaticPaths = async () => {
  // get all articles files names
  const files = await listFiles('blog');
  const paths = files.map((file) => `/blog/${file.replace('.mdx', '')}`);

  return { paths, fallback: false };
};

export const getStaticProps = async ({ params }) => {
  const { article } = params;

  // get mdx file content from article url
  const { mdxSource, frontMatter } = await getMDX(`blog/${article}.mdx`);

  return {
    props: { mdx: mdxSource, metadata: frontMatter },
  };
};

export default ArticlePage;