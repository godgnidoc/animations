import dagre from "@dagrejs/dagre";
import {
  Circle,
  CircleProps,
  initial,
  Line,
  LineProps,
  Node,
  NodeProps,
  signal,
  Txt,
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  SignalValue,
  SimpleSignal,
  ThreadGenerator,
} from "@motion-canvas/core";
import { $ } from "../signal";

export interface VertexProps extends CircleProps {
  id: SignalValue<string>;
  outlined?: SignalValue<boolean>;
}

export class Vertex extends Circle {
  @signal()
  public declare readonly id: SimpleSignal<string, this>;

  @signal()
  @initial(false)
  public declare readonly outlined: SimpleSignal<boolean, this>;

  public readonly text = createRef<Txt>();

  public readonly ring = createRef<Circle>();

  constructor(props: VertexProps) {
    props.lineWidth = 2;
    super(props);

    this.add(
      <Circle
        ref={this.ring}
        size={this.outlined() ? this.size().add(-16) : this.size()}
        lineWidth={2}
      />
    );

    this.add(
      <Txt ref={this.text} textAlign={"center"}>
        {this.id()}
      </Txt>
    );

    this.size(() => Math.max(128, this.text().size().magnitude));
  }

  public outline(value: SignalValue<boolean>, duration?: SignalValue<number>) {
    duration = $(duration);
    this.outlined(value);

    const size = this.outlined() ? this.size().add(-16) : this.size();
    if (duration) {
      return this.ring().size(size, duration);
    } else {
      this.ring().size(size);
    }
  }
}

export interface EdgeProps extends LineProps {
  from: SignalValue<Vertex>;
  to: SignalValue<Vertex>;
  label: SignalValue<string>;
}

export class Edge extends Line {
  @signal()
  public declare readonly from: SimpleSignal<Vertex, this>;

  @signal()
  public declare readonly to: SimpleSignal<Vertex, this>;

  @signal()
  public declare readonly label: SimpleSignal<string, this>;

  public readonly text = createRef<Txt>();

  constructor(props: EdgeProps) {
    props.zIndex = $(props.zIndex) ?? -1;
    props.lineWidth = $(props.lineWidth) ?? 2;
    props.endArrow = $(props.endArrow) ?? true;
    props.arrowSize = $(props.arrowSize) ?? 16;
    props.endOffset = () => $(props.to).width() / 2;
    props.startOffset = () => $(props.from).width() / 2;
    props.points = [$(props.from).position, $(props.to).position];
    super(props);

    const label = $(props.label);
    this.add(
      <Txt
        ref={this.text}
        position={() =>
          this.getPointAtDistance(this.from().width() / 2).position.addY(-32)
        }
      >
        {label}
      </Txt>
    );
  }
}

export type RankDir = "TB" | "BT" | "LR" | "RL";

export interface GraphProps extends NodeProps {
  rankdir: SignalValue<RankDir>;
  nodesep?: SignalValue<number>;
  edgesep?: SignalValue<number>;
  ranksep?: SignalValue<number>;
}

export class Graph extends Node {
  @signal()
  public declare readonly rankdir: SimpleSignal<RankDir, this>;

  @initial(128)
  @signal()
  public declare readonly nodesep: SimpleSignal<number, this>;

  @initial(100)
  @signal()
  public declare readonly edgesep: SimpleSignal<number, this>;

  @initial(128)
  @signal()
  public declare readonly ranksep: SimpleSignal<number, this>;

  public readonly g = new dagre.graphlib.Graph({ directed: true });
  private vertexs_: { [id: string]: Vertex } = {};
  private edges_: { [id: string]: Edge } = {};

  constructor(props: GraphProps) {
    super(props);
    this.g.setGraph({
      rankdir: this.rankdir(),
      nodesep: this.nodesep(),
      edgesep: this.edgesep(),
      ranksep: this.ranksep(),
    });
  }

  vertexs() {
    return Object.values(this.vertexs_);
  }

  edges() {
    return Object.values(this.edges_);
  }

  vertex(id: SignalValue<string>) {
    return this.vertexs_[$(id)];
  }

  edge(from: SignalValue<string | Vertex>, to: SignalValue<string | Vertex>) {
    from = $(from);
    to = $(to);
    if (from instanceof Vertex) from = from.id();
    if (to instanceof Vertex) to = to.id();
    return this.edges_[`${from}-${to}`];
  }

  addVertex(vertex: Node) {
    if (!(vertex instanceof Vertex)) {
      throw new Error("Only Vertex can be added to Graph");
    }
    this.add(vertex);
    this.vertexs_[vertex.id()] = vertex;
    this.g.setNode(vertex.id(), {
      get width() {
        return vertex.width();
      },
      get height() {
        return vertex.height();
      },
    });
    return vertex;
  }

  addEdge(edge: Node) {
    if (!(edge instanceof Edge)) {
      throw new Error("Only Edge can be added to Graph");
    }
    this.add(edge);
    const from = edge.from();
    const to = edge.to();
    const fromId = from.id();
    const toId = to.id();
    this.edges_[`${fromId}-${toId}`] = edge;
    this.g.setEdge(fromId, toId, {
      label: edge.label(),
    });
    return edge;
  }

  layout(duration: number) {
    dagre.layout(this.g);
    const anims: ThreadGenerator[] = [];

    let width = 0;
    let height = 0;

    this.g
      .nodes()
      .map((id) => this.g.node(id))
      .forEach((node) => {
        width = Math.max(width, node.x + node.width / 2);
        height = Math.max(height, node.y + node.height / 2);
      });

    const baseX = width / -2;
    const baseY = height / -2;

    this.g
      .nodes()
      .map((id) => ({ id, node: this.g.node(id) }))
      .forEach(({ id, node }) => {
        const vertex = this.vertex(id);
        anims.push(vertex.position([baseX + node.x, baseY + node.y], duration));
      });

    this.g
      .edges()
      .map((attr) => ({ attr, edge: this.g.edge(attr) }))
      .forEach(({ attr, edge }) => {
        const from = this.g.node(attr.v);
        const to = this.g.node(attr.w);
        const line = this.edge(attr.v, attr.w);
        anims.push(
          line.points(
            [from, ...edge.points, to].map((p) => ({
              x: baseX + p.x,
              y: baseY + p.y,
            })),
            duration
          )
        );
      });

    return all(...anims);
  }
}
