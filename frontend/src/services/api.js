import { products, salesData, topProducts, categoryData, aiSuggestions, demandTrends } from '../data/mockData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // auth: {
  //   login: async (email, password) => {
  //     await delay(800);
  //     if (email && password.length >= 6) {
  //       return { success: true, user: { name: "Arjun Sharma", email, shop: "Sharma Provisions" } };
  //     }
  //     throw new Error("Invalid credentials");
  //   },
  //   signup: async (name, email, password) => {
  //     await delay(1000);
  //     if (name && email && password.length >= 6) {
  //       return { success: true, user: { name, email, shop: `${name.split(' ')[0]}'s Store` } };
  //     }
  //     throw new Error("Signup failed. Please check your details.");
  //   },
  // },
  auth: {
    login: async (email, password) => {
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.error || "Login failed");
      }

      // Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      return data;
    },

    signup: async (name, email, password) => {
      const res = await fetch("http://127.0.0.1:8000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.error || "Signup failed");
      }

      return data;
    },

    // Validate current token and get user data
    validateToken: async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        return null;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/auth/me", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) {
          // Token is invalid, clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          return null;
        }

        const data = await res.json();
        localStorage.setItem("user", JSON.stringify(data));
        return data;
      } catch (error) {
        console.error("Token validation error:", error);
        return null;
      }
    },

    // Logout
    logout: async () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return { success: true };
    }
  },

  mlPredictions: {
    getPredictions: async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://127.0.0.1:8000/ml-predictions/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return await res.json();
    }
  },

 products: {
  getAll: async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://127.0.0.1:8000/products", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    return await res.json();
  },

  add: async (product) => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://127.0.0.1:8000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(product)
    });

    return await res.json();
  },

  update: async (productId, product) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://127.0.0.1:8000/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(product)
    });

    return await res.json();
  },

  delete: async (productId) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://127.0.0.1:8000/products/${productId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    return await res.json();
  }
},

//   analytics: {
//     getSales: async () => { await delay(500); return salesData; },
//     getTopProducts: async () => { await delay(400); return topProducts; },
//     getCategoryDistribution: async () => { await delay(400); return categoryData; },
//     getAISuggestions: async () => { await delay(600); return aiSuggestions; },
//     getDemandTrends: async () => { await delay(500); return demandTrends; },
//     getSummary: async () => {

//   const token = localStorage.getItem("token");

//   const res = await fetch(
//     "http://127.0.0.1:8000/analytics/",
//     {
//       headers: {
//         "Authorization": `Bearer ${token}`
//       }
//     }
//   );

//   return await res.json();
// },
//   },
analytics: {

  getSales: async () => {
    await delay(500);
    return salesData;
  },

  getTopProducts: async () => {
    await delay(400);
    return topProducts;
  },
  getAnalytics: async () => {

  const token = localStorage.getItem("token");

  const res = await fetch(
    "http://127.0.0.1:8000/analytics/",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return await res.json();
},

  getCategoryDistribution: async () => {
    await delay(400);
    return categoryData;
  },

  getAISuggestions: async () => {
    await delay(600);
    return aiSuggestions;
  },

  getDemandTrends: async () => {
    await delay(500);
    return demandTrends;
  },

  getSummary: async () => {

    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://127.0.0.1:8000/analytics/",
      {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );

    return await res.json();
  },

},
aiSuggestions: {

  getSuggestions: async () => {

    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://127.0.0.1:8000/ai-suggestions/",
      {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );

    return await res.json();
  }

},

  billing: {
    getBills: async () => {

  const token = localStorage.getItem("token");

  const res = await fetch("http://127.0.0.1:8000/billing/", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  return await res.json();
},

  generateBill: async (billData) => {

    const token = localStorage.getItem("token");

    const res = await fetch("http://127.0.0.1:8000/billing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(billData)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || data.error || "Failed to save bill");
    }

    return data;
  },

},
};
// const token = localStorage.getItem("token");

// fetch("http://127.0.0.1:8000/protected-route", {
//   headers: {
//     "Authorization": `Bearer ${token}`
//   }
// });