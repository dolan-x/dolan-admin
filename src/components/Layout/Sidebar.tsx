import type { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Nav } from "@douyinfe/semi-ui";
import { breakpointsTailwind, useBreakpoints } from "@r-use/use-breakpoints";

const Sidebar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const breakpoints = useBreakpoints(breakpointsTailwind);

  const [selected, setSelected] = useState<string[]>([location.pathname]);

  function createNavigateTo (path: string) {
    return () => {
      navigate(path);
    };
  }

  const items = [
    {
      itemKey: "/dash",
      text: t("pages.home.label"),
      icon: <div className="i-carbon:dashboard" />,
      onClick: createNavigateTo("/dash"),
    },
    {
      itemKey: "/dash/posts",
      text: t("pages.posts.label"),
      icon: <div className="i-carbon:document" />,
      onClick: createNavigateTo("/dash/posts"),
    },
    {
      itemKey: "/dash/pages",
      text: t("pages.pages.label"),
      icon: <div className="i-carbon:book" />,
      onClick: createNavigateTo("/dash/pages"),
    },
    {
      itemKey: "/dash/tags",
      text: t("pages.tags.label"),
      icon: <div className="i-carbon:tag-group" />,
      onClick: createNavigateTo("/dash/tags"),
    },
    {
      itemKey: "/dash/categories",
      text: t("pages.categories.label"),
      icon: <div className="i-carbon:categories" />,
      onClick: createNavigateTo("/dash/categories"),
    },
    {
      itemKey: "/dash/config",
      text: t("pages.config.label"),
      icon: <div className="i-carbon:settings" />,
      items: [
        {
          itemKey: "/dash/config/site",
          text: t("pages.config.site.label"),
          icon: <div className="i-carbon:content-delivery-network" />,
          onClick: createNavigateTo("/dash/config/site"),
        },
        // TODO
        {
          itemKey: "/dash/config/posts",
          text: t("pages.config.posts.label"),
          icon: <div className="i-carbon:chart-custom" />,
          onClick: createNavigateTo("/dash/config/posts"),
        },
        {
          itemKey: "/dash/config/categories",
          text: t("pages.config.categories.label"),
          icon: <div className="i-carbon:category-add" />,
          onClick: createNavigateTo("/dash/config/categories"),
        },
        {
          itemKey: "/dash/config/tags",
          text: t("pages.config.tags.label"),
          icon: <div className="i-carbon:tag-edit" />,
          onClick: createNavigateTo("/dash/config/tags"),
        },
        {
          itemKey: "/dash/config/functions",
          text: t("pages.config.functions.label"),
          icon: <div className="i-carbon:function" />,
          onClick: createNavigateTo("/dash/config/functions"),
        },
      ],
    },
  ];
  return (
    <Layout.Sider className="md:(relative h-unset!) fixed h-screen z-1000">
      <Nav
        defaultIsCollapsed={breakpoints.smaller("md")}
        selectedKeys={selected}
        className="h-full"
        items={items}
        header={{
          className: "justify-center",
          logo: (
            <div className="w-full flex justify-center">
              <div className="i-carbon:military-camp" />
            </div>
          ),
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
