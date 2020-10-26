import AWS from "aws-sdk";

type MetricData = {
  MetricName: string;
  Dimensions: AWS.CloudWatch.Dimensions;
  Unit: string;
  Value: number;
};

const MAX_AWS_METRIC_COUNT = 10;

class CloudWatchClient {
  private _metricsQueue: Array<MetricData>;
  private _client: AWS.CloudWatch;

  constructor() {
    this._metricsQueue = [];
    this._client = new AWS.CloudWatch({
      apiVersion: "2010-08-01",
      region: "ca-central-1",
    });
  }

  async publish(
    metricName: string,
    value: number,
    unit: string,
    dimensions?: AWS.CloudWatch.Dimensions
  ): Promise<
    | { $response: AWS.Response<Record<string, unknown>, AWS.AWSError> }
    | undefined
  > {
    // Adding Environment dimension for metric.
    const metricDimensions: AWS.CloudWatch.Dimensions = [
      { Name: "Environment", Value: process.env.NODE_ENV || "dev" },
    ].concat(dimensions ?? []);

    const metric: MetricData = {
      MetricName: metricName,
      Dimensions: metricDimensions,
      Unit: unit,
      Value: value,
    };

    this._metricsQueue.push(metric);

    if (this._metricsQueue.length < MAX_AWS_METRIC_COUNT) {
      return;
    }

    const putMetricInput: AWS.CloudWatch.PutMetricDataInput = {
      MetricData: this._metricsQueue,
      Namespace: "My API",
    };

    const putMetricPromise = this._client
      .putMetricData(putMetricInput)
      .promise();
    this._metricsQueue = [];
    return putMetricPromise;
  }
}

const cwClient = new CloudWatchClient();

export default cwClient;
