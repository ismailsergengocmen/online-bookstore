import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import { listProducts } from '../actions/productActions';
// import AuthContext from './AuthContext';

const HomeScreen = ({ match }) => {
  const pageNumber = match.params.pageNumber || 0;
  const dispatch = useDispatch();
  // const currentUser = useContext(AuthContext);
  let currentUser = {
    id: 2,
  }

  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [publicationYear, setPublicationYear] = useState('');
  const [genre, setGenre] = useState(1);
  const [genreChoices, setGenreChoices] = useState([]); // New state variable to store the genre options from the database
  const [filters, setFilters] = useState({});
  const [selectedButton, setSelectedButton] = useState('popular'); // State variable to keep track of the selected button

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  useEffect(() => {
    dispatch(listProducts(pageNumber, true, filters, null, currentUser.id));
  }, [dispatch, pageNumber, filters]);

  useEffect(() => {
    // Fetch genre options from the database
    const fetchGenres = async () => {
      try {
        let genresInDB = await axios.get(
          `http://localhost:8080/api/v1/genres`,
        )
        setGenreChoices(genresInDB.data);
      } catch (error) {
        console.log('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'author') {
      setAuthor(value);
    } else if (name === 'title') {
      setTitle(value);
    } else if (name === 'publicationYear') {
      setPublicationYear(value);
    } else if (name === 'genre') {
      setGenre(value);
    }
  };

  const handleFilterApply = () => {
    const temp = {};
    if (author !== '') {
      temp.author = author
    }
    if (title !== '') {
      temp.title = title
    }
    if (publicationYear !== '') {
      temp.publicationYear = publicationYear
    }
    if (genre !== '') {
      temp.genre = genre
    }
    setFilters(temp);
    console.log(temp)
  };

  const handleButtonClick = (button) => {
    setSelectedButton(button);
    let sortingType;
    const tempFilters = {}
    // Update the product listing based on the selected button
    if(button === 'filter'){
      dispatch(listProducts(pageNumber, true, filters, null, currentUser.id));
    } 
    else {
      if (button === 'popular') {
        sortingType = 0;
      } else if (button === 'new') {
        sortingType = 1
      } else if (button === 'wishlist'){
        sortingType = 2
      }
      dispatch(listProducts(pageNumber, true, tempFilters, sortingType, currentUser.id));
    }
  };

  return (
    <>
      <Row className="d-flex justify-content-around">
        <Button
          variant={selectedButton === 'popular' ? 'primary' : 'secondary'}
          onClick={() => handleButtonClick('popular')}
        >
          Popular Products
        </Button>
        <Button
          variant={selectedButton === 'new' ? 'primary' : 'secondary'}
          onClick={() => handleButtonClick('new')}
        >
          New Products
        </Button>
        <Button
          variant={selectedButton === 'filter' ? 'primary' : 'secondary'}
          onClick={() => handleButtonClick('filter')}
        >
          Filter Products
        </Button>
        <Button
          variant={selectedButton === 'wishlisht' ? 'primary' : 'secondary'}
          onClick={() => handleButtonClick('wishlisht')}
        >
          Wishlist
        </Button>
      </Row>
      {(selectedButton === "filter") && (
      <Form className="mt-5">
        <Row>
          <Col xs={12} md={6} lg={2}>
            <Form.Control
              type='text'
              placeholder='Author'
              name='author'
              value={author}
              onChange={handleFilterChange}
            />
          </Col>
          <Col xs={12} md={6} lg={2}>
            <Form.Control
              type='text'
              placeholder='Title'
              name='title'
              value={title}
              onChange={handleFilterChange}
            />
          </Col>
          <Col xs={12} md={6} lg={2}>
            <Form.Control
              type='text'
              placeholder='Publication Year'
              name='publicationYear'
              value={publicationYear}
              onChange={handleFilterChange}
            />
          </Col>
          <Col xs={12} md={6} lg={2}>
            <Form.Control
              as="select"
              name="genre"
              value={genre}
              onChange={handleFilterChange}
            >
              {genreChoices.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </Form.Control>
          </Col>
          <Col xs={12} md={6} lg={2}>
            <Button onClick={handleFilterApply}>Apply Filter</Button>
          </Col>
        </Row>
      </Form>
      )}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Row>
          {products && products.map((product) => (
            <Col key={product.id} xs={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
      <Paginate pages={pages} page={page} />
    </>
  );
};

export default HomeScreen;