interface Recipe {
  id: string;
  private_id: string;
  name: string;
  author_name: string;
  is_pending: 0 | 1 | string;
  image_link: string;
  description: string;
  ingredients: string;
  likes_count: number;
}

export default Recipe;
