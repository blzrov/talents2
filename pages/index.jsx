import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.scss";

import { sessionOptions } from "/lib/session";
import { withIronSessionSsr } from "iron-session/next";

import axios from "/utils/rest";
import Container from "react-bootstrap/Container";
import {
  SimpleGrid,
  Text,
  Space,
  Image,
  Card,
  Group,
  RingProgress,
  Button,
  useMantineTheme,
  Loader,
  Progress,
} from "@mantine/core";

export default function Home({ courses }) {
  const theme = useMantineTheme();

  return (
    <div className={styles.container}>
      <Head>
        <title>Школа талантов</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Space h="xl" />
        <div style={{ color: "#036459", fontSize: "24px", fontWeight: "600" }}>Мои курсы</div>
        <Space h="lg" />
        <SimpleGrid cols={3}>
          {courses.map(({ course, tasks, tasks_ready }) => {
            return (
              <Link key={course.id} passHref href={`/courses/${course.id}`}>
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  style={{
                    paddingBottom: "6px",
                    cursor: "pointer",
                    border: "2px solid #33CFBD",
                    boxShadow: "0px 2px 20px #BBBBBB",
                  }}
                >
                  <div style={{ fontSize: "15px", fontWeight: "600", color: "#036459" }}>{course.name}</div>
                  <div className="d-flex align-items-center p-2">
                    <Image radius={100} src={"/" + course.image} height={130} width={130} alt="Инкубатор талантов" />
                    <div style={{ paddingLeft: "20px" }}>
                      <RingProgress
                        label={
                          <Text size="xs" align="center">
                            {Math.round((tasks_ready / tasks) * 100)}%
                          </Text>
                        }
                        sections={[{ value: (tasks_ready / tasks) * 100, color: "#1FBEAC" }]}
                      />
                      <div style={{ fontSize: "14px", color: "#036459", paddingLeft: "10px" }}>
                        <span style={{ color: "#1FBEAC" }}>{tasks_ready}</span> выполнено
                      </div>
                      <div style={{ fontSize: "14px", color: "#036459", paddingLeft: "10px" }}>
                        <span style={{ color: "#1FBEAC" }}>{tasks - tasks_ready}</span> осталось
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </SimpleGrid>
      </Container>
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(async function getServerSideProps({ req }) {
  if (!req.cookies["user-cookies"]) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }
  const response = await axios.get(`/public/courses`, {
    headers: {
      Cookie: `user-cookies=${req.cookies["user-cookies"]};`,
    },
  });
  let courses = [];
  if (response.status === 200) {
    courses = response.data;
  }
  return {
    props: {
      courses: courses,
      user: req.session.user,
    },
  };
}, sessionOptions);
