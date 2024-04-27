import React, { useState, useEffect } from "react";
import { Table, Input, Select, Pagination } from "antd";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const { Search } = Input;
const { Option } = Select;

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    fetchData();
  }, [location]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [searchQuery, pagination.current, pagination.pageSize]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://dummyjson.com/posts/search?q=${searchQuery}&skip=${
          (pagination.current - 1) * pagination.pageSize
        }&limit=${pagination.pageSize}`
      );
      const { posts, total } = response.data;
      setPosts(posts);
      setPagination((prevPagination) => ({
        ...prevPagination,
        total,
      }));
      const tags = posts.reduce((acc, post) => {
        post.tags.forEach((tag) => {
          if (!acc.includes(tag)) {
            acc.push(tag);
          }
        });
        return acc;
      }, []);
      setAllTags(tags);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      current: page,
      pageSize,
    }));
    navigate(`?page=${page}`);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setPagination((prevPagination) => ({
      ...prevPagination,
      current: 1, // Reset pagination to first page
    }));
    navigate(`?page=1&search=${value}`);
  };

  const handleTagChange = (value) => {
    setSelectedTags(value);
    setPagination((prevPagination) => ({
      ...prevPagination,
      current: 1, // Reset pagination to first page
    }));
    navigate(`?page=1&tags=${value.join(",")}`);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      className: "text-sky-600 font-semibold",
    },
    {
      title: "Body",
      dataIndex: "body",
      key: "body",
      className: "text-gray-700",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags) => (
        <span className="text-gray-600 capitalize">{tags.join(", ")}</span>
      ),
    },
  ];

  const filteredPosts = selectedTags.length
    ? posts.filter((post) =>
        selectedTags.every((tag) => post.tags.includes(tag))
      )
    : posts;

  return (
    <>
      <section className="bg-gray-100">
        <div className="container mx-auto p-4 sm:p-8">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-bold text-gray-600 mb-4"
          >
            Explore Awesome Posts
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-between mb-4"
          >
            <Search
              placeholder="Search posts"
              onSearch={handleSearch}
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              className="w-full max-w-md mb-4 sm:mb-0 sm:mr-4 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <Select
              mode="multiple"
              style={{ minWidth: 200 }}
              placeholder="Select tags"
              onChange={handleTagChange}
              defaultValue={selectedTags}
              className="w-full sm:w-auto rounded-lg border border-gray-300 px-2 py-2 focus:outline-none focus:border-blue-500"
            >
              {allTags.map((tag) => (
                <Option key={tag} value={tag}>
                  {tag}
                </Option>
              ))}
            </Select>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="table-container overflow-x-auto rounded-lg shadow-lg"
          >
            <Table
              dataSource={filteredPosts}
              columns={columns}
              loading={loading}
              pagination={false}
              bordered
              className="rounded-lg"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex justify-center mt-4"
          >
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePaginationChange}
              className="text-blue-600"
            />
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
