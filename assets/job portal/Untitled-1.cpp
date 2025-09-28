 //Suppose you have data 25,36,48,41,29,65,62,12 and 10. Create a binary earch tree for the given data set and also perfome in order 
 traversal for the same

 #include <iostream>
using namespace std;

// Node structure for the Binary Search Tree
struct Node {
    int data;
    Node* left;
    Node* right;

    // Constructor to initialize a node
    Node(int value) {
        data = value;
        left = nullptr;
        right = nullptr;
    }
};

// Function to insert a new value into the BST
Node* insert(Node* root, int value) {
    if (root == nullptr) {
        return new Node(value);
    }
    if (value < root->data) {
        root->left = insert(root->left, value); // Insert into the left subtree
    } else {
        root->right = insert(root->right, value); // Insert into the right subtree
    }
    return root;
}

// In-order traversal (left -> root -> right)
void inOrderTraversal(Node* root) {
    if (root != nullptr) {
        inOrderTraversal(root->left);
        cout << root->data << " ";
        inOrderTraversal(root->right);
    }
}

int main() {
    // Data set
    int data[] = {25, 36, 48, 41, 29, 65, 62, 12, 10};
    int n = sizeof(data) / sizeof(data[0]);

    Node* root = nullptr; // Start with an empty tree

    // Insert data into the BST
    for (int i = 0; i < n; i++) {
        root = insert(root, data[i]);
    }

    // Perform in-order traversal
    cout << "In-order Traversal: ";
    inOrderTraversal(root);
    cout << endl;

    return 0;
}
