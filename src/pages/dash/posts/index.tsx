import type { FC } from "react";
import { Link } from "react-router-dom";
import { useAsyncEffect } from "use-async-effect";
import { Badge, Table, Tag, Toast } from "@douyinfe/semi-ui";

import type { Tag as DolanTag, Post } from "@dolan-x/shared";

import { fetchApi } from "~/lib";
import { toDisplayDate } from "~/utils";

const Posts: FC = () => {
  const { t } = useTranslation();

  const [posts, setPosts] = useState<Post[]>([]);
  const [meta, setMeta] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);

  const onFetch = async() => {
    const resp = await fetchApi("posts");
    if (resp.success) {
      setPosts(resp.data);
      setMeta(resp.meta);
    } else { Toast.error(t("pages.posts.failed")); }
  };

  useAsyncEffect(onFetch);

  const renderTitle = (title: string, item: Post) => {
    return (
      <div>
        <Link to={`./edit/${item.slug}`}>
          {item.sticky
            ? <div className="text-red-600 h-5 i-carbon-pin" />
            : null}
          {title || t("pages.posts.no-title")}
        </Link>
      </div>
    );
  };

  const statusMapping = {
    published: <Badge dot className="!bg-$semi-color-success" />,
    draft: <Badge dot type="danger" />,
  };

  const renderStatus = (status: Post["status"]) => {
    if (!(status in statusMapping)) return null;
    return (
      <>
        {statusMapping[status as keyof typeof statusMapping]}
      </>
    );
  };

  const renderTags = (tags: DolanTag[]) => {
    return (
      <div>
        {tags.length !== 0
          ? tags.map((tag) => {
            return (
              <Tag key={tag.slug}>
                {tag.name}
              </Tag>
            );
          })
          : t("pages.posts.no-tags")}
      </div>
    );
  };

  const renderCreatedDate = (publishedDate: Post["created"]) => {
    return (
      <div>
        {toDisplayDate(publishedDate)}
      </div>
    );
  };

  return (
    <div>
      <Table
        dataSource={posts}
        pagination={{
          currentPage,
          pageSize: meta.pages,
        }}
      >
        {/* TODO: I18N */}
        <Table.Column title="标题" dataIndex="title" key="title" render={renderTitle} />
        <Table.Column title="状态" dataIndex="status" key="status" render={renderStatus} />
        <Table.Column title="标签" dataIndex="tags" key="tags" render={renderTags} />
        <Table.Column title="创建日期" dataIndex="created" key="created" render={renderCreatedDate} />
      </Table>
      
    </div>
  );
};

export default Posts;
