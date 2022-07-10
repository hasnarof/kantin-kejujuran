import React, { useState } from "react";
import axios from "axios";
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Stack,
  Card,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSolid,
  faCirclePlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import storage from "../config/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function Home() {
  const [products, setProducts] = React.useState([]);
  const [showModalAddProduct, setShowModalAddProduct] = useState(false);
  const [inputsProduct, setInputsProduct] = useState({});
  const [inputProductImage, setInputProductImage] = useState("");
  const [percent, setPercent] = useState(0);

  const [balance, setBalance] = useState(0);
  const [transactionAmount, setTransactionAmount] = useState(0);

  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  React.useEffect(() => {
    getProducts();
    getBalance();
  }, []);

  const getProducts = () => {
    axios
      .get(`/api/products`)
      .then((res) => {
        setProducts(res.data.data);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeProduct = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputsProduct((values) => ({ ...values, [name]: value }));
  };

  const handleChangeProductImage = (event) => {
    setInputProductImage(event.target.files[0]);
  };

  const handleSubmitProduct = (e) => {
    e.preventDefault();
    if (!inputProductImage) {
      alert("Please choose a file first!");
    }

    const storageRef = ref(storage, `/files/${inputProductImage.name}`);
    const uploadTask = uploadBytesResumable(storageRef, inputProductImage);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        // update progress
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          axios
            .post(`/api/products`, { image: url, ...inputsProduct })
            .then((res) => {
              console.log(res);
              getProducts();
              setShowModalAddProduct(false);
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }
    );
  };

  const handleDeleteProduct = (id) => {
    if (confirm("Are you sure want to delete this product?") == true) {
      axios
        .delete(`api/products/${id}`)
        .then((res) => {
          getProducts();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getBalance = () => {
    axios
      .get(`/api/balance`)
      .then((res) => {
        setBalance(res.data.data.amount);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeTransactionAmount = (event) => {
    setTransactionAmount(event.target.value);
  };

  const updateBalance = (transactionType) => {
    if (transactionType === "credit") {
      if (transactionAmount > balance) {
        alert("Insufficient balance!");
      } else {
        axios
          .put(`/api/balance`, { type: "credit", amount: transactionAmount })
          .then((res) => {
            getBalance();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      axios
        .put(`/api/balance`, { type: "debit", amount: transactionAmount })
        .then((res) => {
          getBalance();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div>
      <Navbar bg="light" variant="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">
            <span className="fw-bolder">Kantin Kejujuran</span>
            <br></br>
            <span className="fs-6 fw-light">SD SEA Sentosa</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#deets">Login</Nav.Link>
              <Nav.Link eventKey={2} href="#memes">
                Register
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <Row>
          <Col
            xs={12}
            md={8}
            style={{}}
            id="product-container"
            className="mt-3"
          >
            <h3>Products</h3>
            <Row className="gy-4">
              {products.map((product) => (
                <Col xs={12} md={3}>
                  <Card className="shadow-sm" style={{ border: "none" }}>
                    <Card.Img
                      variant="top"
                      src={product.image}
                      className="img-fluid"
                      style={{ height: "130px" }}
                    />
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text>{product.description}</Card.Text>
                      <FontAwesomeIcon
                        id="btn-delete-product"
                        icon={(faSolid, faTrash)}
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => handleDeleteProduct(product.id)}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
          <Col xs={12} md={4} className="mt-4">
            <h5>Balances</h5>
            <h1>{currencyFormatter.format(balance)}</h1>
            <Row>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Jumlah Setoran/Tarikan</Form.Label>
                  <Form.Control
                    type="number"
                    value={transactionAmount}
                    onChange={handleChangeTransactionAmount}
                  />
                </Form.Group>
                <div className="d-flex flex-row-reverse gap-2">
                  <Button variant="info" onClick={() => updateBalance("debit")}>
                    Setor
                  </Button>
                  <Button
                    variant="info"
                    onClick={() => updateBalance("credit")}
                  >
                    Tarik
                  </Button>
                </div>
              </Form>
            </Row>
          </Col>
        </Row>
      </Container>
      <FontAwesomeIcon
        icon={(faSolid, faCirclePlus)}
        id="fab-add"
        color="deepskyblue"
        onClick={() => setShowModalAddProduct(true)}
        style={{
          position: "fixed",
          bottom: "50px",
          right: "50px",
          cursor: "pointer",
          width: "50px",
          height: "50px",
          borderRadius: "100%",
          boxShadow: "10px 10px 5px #aaaaaa",
        }}
      />
      <Modal
        show={showModalAddProduct}
        onHide={() => setShowModalAddProduct(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitProduct}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={inputsProduct.name || ""}
                onChange={handleChangeProduct}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="10000"
                name="price"
                value={inputsProduct.price || ""}
                onChange={handleChangeProduct}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={inputsProduct.description || ""}
                onChange={handleChangeProduct}
              />
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleChangeProductImage}
              />
            </Form.Group>
          </Form>
          <p>Upload image progress: {percent} %</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModalAddProduct(false)}
          >
            Close
          </Button>
          <Button variant="info" onClick={handleSubmitProduct}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
