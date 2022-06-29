import type { FC } from "react";
import { Link } from "react-router-dom";
import { useAsyncEffect } from "use-async-effect";
import { Badge, Button, Card, Table, Tag, Toast } from "@douyinfe/semi-ui";
import type { Tag as DolanTag, Post } from "@dolan-x/shared";

import { fetchApi } from "~/lib";
import { toDisplayDate } from "~/utils";

const statusMapping = {
  published: <Badge dot className="!bg-$semi-color-success" />,
  draft: <Badge dot type="danger" />,
};

const Posts: FC = () => {
  const { t } = useTranslation();

  const [posts, setPosts] = useState<Post[]>([]);
  const [meta, setMeta] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);

  async function onFetch () {
    const resp = await fetchApi("posts");
    if (resp.success) {
      setPosts(resp.data);
      setMeta(resp.metas);
    } else { Toast.error(t("pages.posts.failed")); }
  }

  useAsyncEffect(onFetch, []);

  function renderTitle (title: string, item: Post) {
    return (
      <div className="text-blue-400">
        <Link to={`./edit/${item.slug}`}>
          {item.sticky
            ? <div className="text-red-600 h-4 i-carbon-pin" />
            : null}
          &nbsp;
          {title || t("pages.posts.no-title")}
        </Link>
      </div>
    );
  }

  function renderStatus (status: Post["status"]) {
    if (!(status in statusMapping))
      return null;
    return (
      <>
        {statusMapping[status as keyof typeof statusMapping]}
        &nbsp;
        {t(`pages.posts.status.${status}`)}
      </>
    );
  }

  function renderTags (tags: DolanTag[]) {
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
  }

  function renderCreatedDate (publishedDate: Post["created"]) {
    return (
      <div>
        {toDisplayDate(publishedDate)}
      </div>
    );
  }

  return (
    <div>
      <Link to="./new">
        <Button className="mb-4" theme="solid" type="primary">
          {t("pages.posts.new-post")}
        </Button>
      </Link>
      <Card>
        <Table
          dataSource={posts}
          pagination={{
            currentPage,
            pageSize: meta.pages,
          }}
        >
          <Table.Column title={t("pages.posts.title")} dataIndex="title" key="title" render={renderTitle} />
          <Table.Column title={t("pages.posts.status.label")} dataIndex="status" key="status" render={renderStatus} />
          <Table.Column title={t("pages.posts.tags")} dataIndex="tags" key="tags" render={renderTags} />
          <Table.Column title={t("pages.posts.created")} dataIndex="created" key="created" render={renderCreatedDate} />
        </Table>
      </Card>
    </div>
  );
};

export default Posts;
