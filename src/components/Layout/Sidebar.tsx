import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Nav } from "@douyinfe/semi-ui";

const Sidebar: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selected, setSelected] = useState<string[]>([]);

  const itemsOriginal = [
    {
      itemKey: "posts-management",
      text: t("sidebar.posts-management"),
      to: "/dash/posts",
      icon: <div className="i-carbon-document" />,
    },
    {
      itemKey: "pages-management",
      text: t("sidebar.pages-management"),
      to: "/dash/pages",
      icon: <div className="i-carbon-book" />,
    },
    {
      itemKey: "tags-management",
      text: t("sidebar.tags-management"),
      to: "/dash/tags",
      icon: <div className="i-carbon-tag-group" />,
    },
    {
      itemKey: "categories-management",
      text: t("sidebar.categories-management"),
      to: "/dash/categories",
      icon: <div className="i-carbon-categories" />,
    },
    {
      itemKey: "config-management",
      text: t("sidebar.config-management"),
      to: "/dash/config",
      icon: <div className="i-carbon-settings" />,
    },
  ];
  const items = useMemo(() => itemsOriginal.map(i => ({ ...i, onClick: () => navigate(i.to) })), [itemsOriginal]);

  return (
    <Layout.Sider>
      <Nav
        selectedKeys={selected}
        className="h-full"
        items={items}
        header={{
          className: "justify-center",
          logo: <div className="i-carbon-military-camp" />,
          text: "Dolan Admin",
        }}
        footer={{
          collapseButton: true,
          collapseText: () => t("sidebar.hide"),
        }}
        onSelect={data => setSelected([data.itemKey as string])}
      />
    </Layout.Sider>
  );
};

export default Sidebar;
