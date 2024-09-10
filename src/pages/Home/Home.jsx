import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../components/Header';
import CarouselFadeExample from '../components/CarouselFadeExample'; // CarouselFadeExample 컴포넌트 임포트
import MainContent from '../Home/MainContent';
import '../css/Home.css';
import axios from 'axios';
import StudyCard from '../Study/StudyCard';

const Home = () => {
  const [nickName, setNickName] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [studies, setStudies] = useState([]);

  const homeStudyList = ({ studies }) => (
    <Row>
      {studies.map((study) => (
        <Col key={study.studyId} md={4} className="mb-3">
          <StudyCard study={study} />
        </Col>
      ))}
    </Row>
  );

  const checkAuth = async () => {
    try {
      const checkToken = localStorage.getItem('accessToken');
      const response = await axios.get('/oauth/login/state', {
        headers: { Authorization: `Bearer ${checkToken}` },
      });
      if(response.data.state === false) {
        setIsAuthenticated(false);
      }else{
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('인증 확인 중 오류 발생:', error);
      setIsAuthenticated(false);
    }
  };

  const fetchMemberInfo = async (token) => {
    try {
      const response = await axios.get('/member/mypage/info', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('memberInfo', response.data);
      setNickName(response.data.nickName);
    } catch (error) {
      console.error('회원 정보 가져오기 중 오류 발생:', error);
    }
  };

  const fetchStudies = async () => {
    try {
      const response = await axios.get('/study/home/studylist');
      console.log('studies', response.data);
      setStudies(response.data);
    } catch (error) {
      console.error('스터디 목록 가져오기 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    checkAuth();
    fetchStudies();
  }, []);

  useEffect(() => {
    if (isAuthenticated === true) {
      console.log('로그인 상태:', isAuthenticated);
      const token = localStorage.getItem('accessToken');
      if (token) {
        fetchMemberInfo(token);
      }
    }
  }, [isAuthenticated]);

  return (
    <>
      <Header />
      <Container fluid className="px-0">
        <Container className="py-4">
          <Row className="justify-content-center mb-4">
            {isAuthenticated ? (
              <Col>
                <h2>{nickName}</h2>
              </Col>
            ) : (
              <Col>
                <h2>Please log in to continue.</h2>
              </Col>
            )}
          </Row>
        </Container>
        {homeStudyList({ studies })}
      </Container>
      <footer className="footer bg-light py-3 mt-auto">
        <Container>
          <Row>
            <Col md={6} className="text-center text-md-start">
              <p className="mb-0">&copy; 2024 Study With Me. All rights reserved.</p>
            </Col>
            <Col md={6} className="text-center text-md-end mt-3 mt-md-0">
              <a href="/contact" className="me-3">Contact Us</a>
              <a href="/privacy">Privacy Policy</a>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Home;