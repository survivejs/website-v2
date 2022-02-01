function resolveKeywordToTitle(keyword: string) {
  switch (keyword) {
    case "ajax":
      return "AJAX";
    case "api":
      return "API";
    case "baas":
      return "BaaS";
    case "cssinjs":
      return "css-in-js";
    case "ecommerce":
      return "E-commerce";
    case "json":
      return "JSON";
    case "react native":
      return "React Native";
    case "javascript":
      return "JavaScript";
    case "typescript":
      return "TypeScript";
    case "graphql":
      return "GraphQL";
    case "npm":
      return "npm";
    case "survivejs":
      return "SurviveJS";
    case "nodejs":
      return "NodeJS";
    case "reasonml":
      return "ReasonML";
    default:
      return (keyword[0].toUpperCase() + keyword.slice(1)).replace(/-/g, " ");
  }
}

export default resolveKeywordToTitle;
